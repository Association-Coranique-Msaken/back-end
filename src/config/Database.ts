import { DataSource } from "typeorm";
import "reflect-metadata";

const { MYSQL_HOST: MYSQL_HOST, MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD, MYSQL_LOCAL_PORT, NODE_ENV } = process.env;
export const appDataSource = new DataSource({
    type: "mysql",
    // host: "mysqldb",
    // port: 3360,
    host: "localhost",
    port: 3306,
    username: "root",
    password: "",
    database: "AssociationCoranique",
    entities: ["src/entities/*.ts"],
    synchronize: NODE_ENV === "dev" ? false : false,
    // synchronize: true,
    //logging logs sql command on the treminal
    logging: NODE_ENV === "dev" ? false : false,
    subscribers: [],
});
