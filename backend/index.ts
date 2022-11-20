import { createRequire } from "module";
import ws from "ws";

declare interface Bun {}

const CLIENTS_TO_WAIT_FOR = parseInt(process.env.CLIENTS_COUNT || "", 10) || 16;
var remainingClients = CLIENTS_TO_WAIT_FOR;
const COMPRESS = process.env.COMPRESS === "1";
const port = process.env.PORT || 4001;

const server = Bun.serve({
  port: port,
  websocket: {
    open(ws: {
      subscribe: (arg0: string) => void;
      data: { name: any };
      publishText: (arg0: string, arg1: string) => void;
    }) {
      ws.subscribe("room");

      remainingClients--;
      console.log(`${ws.data.name} connected (${remainingClients} remain)`);

      if (remainingClients === 0) {
        console.log("All clients connected");
        setTimeout(() => {
          console.log('Starting benchmark by sending "ready" message');
          ws.publishText("room", `ready`);
        }, 100);
      }
    },
    message(
      ws: {
        data: { name: any };
        publishText: (arg0: string, arg1: string) => number;
      },
      msg: any
    ) {
      const out = `${ws.data.name}: ${msg}`;
      if (ws.publishText("room", out) !== out.length) {
        throw new Error("Failed to publish message");
      }
    },
    close(ws: any) {
      remainingClients++;
    },

    perMessageDeflate: false,
  },

  fetch(
    req: { url: string | URL },
    server: { upgrade: (arg0: any, arg1: { data: { name: string } }) => any }
  ) {
    if (
      server.upgrade(req, {
        data: {
          name:
            new URL(req.url).searchParams.get("name") ||
            "Client #" + (CLIENTS_TO_WAIT_FOR - remainingClients),
        },
      })
    )
      return;

    return new Response("Error");
  },
});

console.log(
  `Waiting for ${remainingClients} clients to connect...\n`,
  `  http://${server.hostname}:${port}/`
);
