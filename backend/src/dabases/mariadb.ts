import mysql from "mysql2";
import dbConfig from "./dbConfig.js";

const { host, port, user, password, database } = dbConfig;

const filteredConfig = Object.fromEntries(
  Object.keys(dbConfig)
    .filter((key) => dbConfig[key])
    .map((key) => [key, dbConfig[key]])
);

let connection: mysql.Connection | null = null;

let limitConnection = 5;

function keepAliveConnection() {
  connection = mysql.createConnection(filteredConfig);
  connection.on("connection", (stream: any) => {
    console.log(stream);
    console.log("mariadb is connect!");
  });
  connection.on("error", (error: any) => {
    if (error) {
      limitConnection--;
      if (limitConnection < 0) {
        return;
      }
      keepAliveConnection();
    }
  });
}

keepAliveConnection();

const start = Date.now();

function ping() {
  const now = Date.now();
  console.log("ping!");
  if (connection !== null) {
    connection.ping((error: any) => {
      if (error) {
        limitConnection--;
        if (limitConnection < 0) {
          return;
        }
        keepAliveConnection();
      }
    });
  }
  console.log("%d s 경과", ((now - start) / 1000).toFixed(5));
}

setInterval(() => {
  ping();
}, 5000);

export { connection };
