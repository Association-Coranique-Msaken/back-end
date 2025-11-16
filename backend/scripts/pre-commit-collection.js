#!/usr/bin/env node

/**
 * Pre-commit hook to regenerate API collection when routes change
 * Works cross-platform (Windows, macOS, Linux)
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("");
console.log("🚀 Running pre-commit collection generation check...");
console.log(`📂 Working directory: ${process.cwd()}`);

// Get list of staged files
let stagedFiles = [];
try {
    const output = execSync("git diff --cached --name-only", { encoding: "utf8" });
    stagedFiles = output
        .trim()
        .split("\n")
        .filter((f) => f);
    console.log(`🔍 Found ${stagedFiles.length} staged files`);
} catch (error) {
    console.error("❌ Failed to get staged files:", error.message);
    process.exit(1);
}

// Check if any route files were modified
// Support both monorepo paths (backend/src/routes/) and direct paths (src/routes/)
const routeFiles = stagedFiles.filter(
    (file) => file.match(/src[\/\\]routes[\/\\].*\.ts$/) || file.match(/backend[\/\\]src[\/\\]routes[\/\\].*\.ts$/)
);

if (routeFiles.length === 0) {
    console.log("ℹ️  No route files modified, skipping collection generation");
    process.exit(0);
}

console.log("📝 Route files modified:", routeFiles.join(", "));

// Check if swagger.json exists
const swaggerPath = path.join(__dirname, "..", "swagger.json");
if (!fs.existsSync(swaggerPath)) {
    console.log("");
    console.log("⚠️  swagger.json not found!");
    console.log("   Start the server to generate it:");
    console.log("   npm run dev");
    console.log("");
    console.log("   Then run manually:");
    console.log("   npm run generate:collection");
    console.log("");
    console.log("⚠️  Proceeding without collection update...");
    process.exit(0);
}

console.log("✅ swagger.json found");

// Try to update swagger.json from Docker if container is running
console.log("🐳 Checking for running Docker container...");
try {
    execSync("docker exec back-end-backend-1 cat /app/swagger.json > swagger.json", {
        encoding: "utf8",
        stdio: "pipe",
    });
    console.log("✅ Updated swagger.json from Docker container");
} catch (error) {
    console.log("⚠️  Could not update from Docker (container may not be running)");
    console.log("   Using existing swagger.json file");
}

// Regenerate the collection
console.log("🔄 Regenerating API collection from swagger.json...");
try {
    execSync("npm run generate:collection", {
        stdio: "inherit",
        encoding: "utf8",
    });
} catch (error) {
    console.error("❌ Failed to generate collection:", error.message);
    console.log("");
    console.log("⚠️  Collection generation failed, but commit will proceed");
    console.log("   Run manually later: npm run generate:collection");
    process.exit(0); // Don't block the commit
}

// Stage the generated collection
const collectionPath = path.join(__dirname, "..", "hoppscotch-collection.json");
if (fs.existsSync(collectionPath)) {
    try {
        execSync("git add hoppscotch-collection.json", { encoding: "utf8" });
        console.log("✅ API collection updated and staged");
    } catch (error) {
        console.error("❌ Failed to stage collection:", error.message);
    }
} else {
    console.log("⚠️  Generated collection file not found");
}

console.log("");
