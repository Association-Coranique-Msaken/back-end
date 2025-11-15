import fs from "fs";
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");

const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "REST API for AQM", // Title of the documentation
        version: "1.0.0", // Version of the app
        description: "This is the REST API for AQM", // short description of the app
    },
    url: "https://localhost:5000", // the host or url of the app
    basePath: "/api/v1", // the basepath of your endpoint

    tags: [
        {
            name: "auth",
            description: "Authentication APIs",
        },
        {
            name: "admin-api",
            description: "Admin APIs",
        },
        {
            name: "user-api",
            description: "User APIs",
        },
        {
            name: "teacher-api",
            description: "Teacher APIs",
        },
    ],
};

const options = {
    swaggerDefinition,
    // Paths to files containing OpenAPI definitions
    apis: ["./src/routes/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: any) => {
    // Serve Swagger UI with the dynamically generated Swagger JSON
    fs.writeFileSync("./swagger.json", JSON.stringify(swaggerSpec, null, 2));
    // Serve Swagger UI at /api-docs endpoint
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));
};
