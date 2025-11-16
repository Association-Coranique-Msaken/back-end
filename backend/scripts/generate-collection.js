#!/usr/bin/env node

/**
 * Generate Postman/Hoppscotch collection from swagger.json
 * This script converts the OpenAPI specification to Postman Collection v2.1 format
 */

const fs = require("fs");
const path = require("path");
const Converter = require("openapi-to-postmanv2");

const swaggerPath = path.join(__dirname, "..", "swagger.json");
const outputPath = path.join(__dirname, "..", "hoppscotch-collection.json");

// Check if swagger.json exists
if (!fs.existsSync(swaggerPath)) {
    console.error("❌ swagger.json not found. Start the server first to generate it.");
    console.error("   Run: npm run dev (in a separate terminal)");
    process.exit(1);
}

// Read swagger.json
const swaggerContent = fs.readFileSync(swaggerPath, "utf8");
let swaggerSpec;

try {
    swaggerSpec = JSON.parse(swaggerContent);
} catch (error) {
    console.error("❌ Failed to parse swagger.json:", error.message);
    process.exit(1);
}

// Conversion options
const options = {
    defaultAuth: "bearer",
    requestNameSource: "url",
    indentCharacter: " ",
    collapseFolders: true,
    optimizeConversion: false,
    stackLimit: 10,
    includeAuthInfoInExample: false,
    requestParametersResolution: "example",
    folderStrategy: "tags",
};

// Convert OpenAPI to Postman Collection
Converter.convert({ type: "json", data: swaggerSpec }, options, (err, conversionResult) => {
    if (err) {
        console.error("❌ Conversion failed:", err);
        process.exit(1);
    }

    if (!conversionResult.result) {
        console.error("❌ Conversion failed:", conversionResult.reason);
        process.exit(1);
    }

    // Get the generated collection
    let collection = conversionResult.output[0].data;

    // Build a map of path+method -> summary from swagger spec for better naming
    const summaryMap = {};
    if (swaggerSpec.paths) {
        Object.keys(swaggerSpec.paths).forEach((path) => {
            const pathItem = swaggerSpec.paths[path];
            Object.keys(pathItem).forEach((method) => {
                if (pathItem[method] && pathItem[method].summary) {
                    const key = `${method.toUpperCase()} ${path}`;
                    summaryMap[key] = pathItem[method].summary;
                }
            });
        });
    }

    // Enhance the collection with environment variables
    collection.variable = [
        {
            key: "base_url",
            value: "http://localhost:5000",
            type: "string",
        },
        {
            key: "access_token",
            value: "",
            type: "string",
        },
        {
            key: "refresh_token",
            value: "",
            type: "string",
        },
    ];

    // Update collection info
    collection.info.name = "AQM Backend API";
    collection.info.description = "Auto-generated from OpenAPI specification. Import into Hoppscotch or Postman.";
    collection.info.schema = "https://schema.getpostman.com/json/collection/v2.1.0/collection.json";

    // Process all items to replace URLs and auth headers
    const processItems = (items, summaryMap) => {
        if (!items) return;

        items.forEach((item) => {
            if (item.item) {
                // It's a folder, recurse
                processItems(item.item, summaryMap);
            } else if (item.request) {
                // It's a request
                const request = item.request;

                // Extract method and path for lookup
                const method = request.method || "GET";
                let path = "";
                if (typeof request.url === "string") {
                    // Extract path from URL string
                    path = request.url.replace(/https?:\/\/[^\/]+/, "").replace(/{{base_url}}/g, "");
                } else if (request.url && request.url.raw) {
                    path = request.url.raw.replace(/https?:\/\/[^\/]+/, "").replace(/{{base_url}}/g, "");
                } else if (request.url && request.url.path) {
                    path = "/" + (Array.isArray(request.url.path) ? request.url.path.join("/") : request.url.path);
                }

                // Normalize path parameters for lookup (convert :id to {id})
                const normalizedPath = path.replace(/:(\w+)/g, "{$1}");

                // Look up the summary from swagger spec
                const lookupKey = `${method} ${normalizedPath}`;
                const summary = summaryMap[lookupKey];

                // Use summary if available, otherwise fall back to description
                if (summary) {
                    item.name = summary;
                    request.name = summary;
                } else if (request.description && request.description.content) {
                    // Use the description as fallback
                    item.name = request.description.content;
                    request.name = request.description.content;
                } else if (request.name && request.name.includes("{{baseUrl}}")) {
                    // If name is still the URL, try to make it more readable
                    const cleanName = request.name
                        .replace(/{{baseUrl}}\/api\/v1\//g, "")
                        .replace(/\//g, " > ")
                        .replace(/-/g, " ")
                        .split(" ")
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ");
                    item.name = cleanName;
                    request.name = cleanName;
                }

                // Replace URL with {{base_url}} variable
                if (request.url) {
                    if (typeof request.url === "string") {
                        request.url = request.url.replace(/https?:\/\/localhost:5000/g, "{{base_url}}");
                    } else if (typeof request.url === "object") {
                        // Build URL from structured format
                        let urlString = "";

                        // Handle the raw URL if it exists
                        if (request.url.raw) {
                            urlString = request.url.raw;
                        } else {
                            // Build from parts - but just get the path, base_url has protocol+host
                            const path = Array.isArray(request.url.path)
                                ? "/" + request.url.path.join("/")
                                : request.url.path || "";
                            const query =
                                Array.isArray(request.url.query) && request.url.query.length > 0
                                    ? "?" + request.url.query.map((q) => `${q.key}=${q.value || ""}`).join("&")
                                    : "";

                            urlString = `http://localhost:5000${path}${query}`;
                        }

                        // Replace localhost URL with variable (this will replace protocol+host+port)
                        urlString = urlString.replace(/https?:\/\/localhost:5000/g, "{{base_url}}");

                        // Set as simple string
                        request.url = urlString;
                    }
                }

                // Set proper Bearer Token authentication
                const isAuthEndpoint =
                    request.url &&
                    (typeof request.url === "string" ? request.url : request.url.raw || "").includes("/auth/");

                if (!isAuthEndpoint) {
                    // Set auth field for non-auth endpoints
                    request.auth = {
                        type: "bearer",
                        bearer: [
                            {
                                key: "token",
                                value: "{{access_token}}",
                                type: "string",
                            },
                        ],
                    };
                } else {
                    // Auth endpoints don't need authentication
                    request.auth = null;
                }

                // Remove Authorization headers since we're using auth field instead
                if (request.header) {
                    request.header = request.header.filter((h) => h.key !== "Authorization");
                }
            }
        });
    };

    processItems(collection.item, summaryMap);

    // Write the collection to file
    try {
        fs.writeFileSync(outputPath, JSON.stringify(collection, null, 2), "utf8");
        console.log("✅ Successfully generated hoppscotch-collection.json");
        console.log(`   Generated ${collection.item ? collection.item.length : 0} folders with endpoints`);
        console.log("   Import into Hoppscotch or Postman to test the API");
    } catch (error) {
        console.error("❌ Failed to write collection file:", error.message);
        process.exit(1);
    }
});
