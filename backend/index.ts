import { connection } from "./src/assets/scripts/mariadb.js";
import ws from "ws";

// See ./README.md for instructions on how to run this benchmark.
const port = process.env.PORT || 3000;
const CLIENTS_TO_WAIT_FOR = parseInt(process.env.CLIENTS_COUNT || "", 10) || 16;

import { createRequire } from "module";
const require = createRequire(import.meta.url);
let WebSocketServer = require("ws").Server,
  config = {
    host: "0.0.0.0",
    port,
  },
  wss = new WebSocketServer(config, function () {
    console.log(`Waiting for ${CLIENTS_TO_WAIT_FOR} clients to connect..`);
  });

let clients: any[] = [];

wss.on(
  "connection",
  function (
    ws: {
      on: (
        arg0: string,
        arg1: { (message: any): void; (ws: any): void }
      ) => void;
    },
    { url }: any
  ) {
    const name = new URL(
      new URL(url, "http://localhost:3000")
    ).searchParams.get("name");
    console.log(
      `${name} connected (${CLIENTS_TO_WAIT_FOR - clients.length} remain)`
    );
    clients.push(ws);

    ws.on("message", function (message: any) {
      const out = `${name}: ${message}`;
      for (let client of clients) {
        client.send(out);
      }
    });

    // when a connection is closed
    ws.on("close", function (ws: any) {
      clients.splice(clients.indexOf(ws), 1);
    });

    if (clients.length === CLIENTS_TO_WAIT_FOR) {
      sendReadyMessage();
    }
  }
);

function sendReadyMessage() {
  console.log("All clients connected");
  setTimeout(() => {
    console.log("Starting benchmark");
    for (let client of clients) {
      client.send(`ready`);
    }
  }, 100);
}

connection
  ?.promise()
  .query("SELECT * FROM user")
  .then(([rows, fields]) => {
    console.log(rows);
  });
