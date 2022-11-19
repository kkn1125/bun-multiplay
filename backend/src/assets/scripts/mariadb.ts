import mysql from "mysql2";
import dbConfig from "./dbConfig.js";

const { host, port, user, password, database } = dbConfig;

const filteredConfig = Object.fromEntries(
  Object.keys(dbConfig)
    .filter((key) => dbConfig[key])
    .map((key) => [key, dbConfig[key]])
);

let connection: mysql.Connection | null = null;

function keepAliveConnection() {
  connection = mysql.createConnection(filteredConfig);
  connection.on("error", (error: any) => {
    connection = mysql.createConnection(filteredConfig);
  });
}

keepAliveConnection();

function ping() {
  if (connection !== null) {
  }
}

export { connection };
