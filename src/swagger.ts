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
            name: "adminapi",
            description: "Admin APIs",
        },
        {
            name: "userapi",
            description: "User APIs",
        },
        {
            name: "teacherapi",
            description: "Teacher APIs",
        },
    ],
};

console.log(swaggerDefinition);

const options = {
    swaggerDefinition,
    // Paths to files containing OpenAPI definitions
    apis: ["./src/routes/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: any) => {
    // Serve Swagger UI with the dynamically generated Swagger JSON
    fs.writeFileSync("./swagger.json", JSON.stringify(swaggerSpec, null, 2));
    // Serve Swagger UI with the dynamically generated Swagger JSON
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));
};
