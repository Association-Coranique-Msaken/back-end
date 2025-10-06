import { DataSource } from "typeorm";
import "reflect-metadata";

const { MYSQL_HOST, MYSQL_DB, MYSQL_USER, MYSQL_PASSWORD, MYSQL_PORT, NODE_ENV } = process.env;
export const appDataSource = new DataSource({
    type: "mysql",
    host: NODE_ENV === "prod" ? MYSQL_HOST : "mysqldb",
    port: NODE_ENV === "prod" ? parseInt(MYSQL_PORT!) : 3306,
    username: NODE_ENV === "prod" ? MYSQL_USER : "root",
    password: NODE_ENV === "prod" ? MYSQL_PASSWORD : "",
    database: NODE_ENV === "prod" ? MYSQL_DB : "AssociationCoranique",
    entities: ["src/entities/*.ts"],
    synchronize: NODE_ENV === "prod" ? false : true,
    // Logging logs SQL commands in the terminal
    logging: NODE_ENV === "prod" ? false : true,
    subscribers: [],
});
