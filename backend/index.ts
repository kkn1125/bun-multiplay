import { Server, ServerWebSocket } from "bun";

const port = Number(process.env.SOCKET_PORT) || 3000;

const server = Bun.serve({
  port: port,
  websocket: {
    open(ws: any) {
      console.log("connection!");
      ws.subscribe("broadcast");
      ws.send("test");
    },
    message(ws: ServerWebSocket<any>, message: string | Uint8Array) {
      console.log(ws);
      console.log(message);
    },
    close(ws: ServerWebSocket) {
      // console.log(ws);
    },

    perMessageDeflate: false,
  },

  fetch(req: Request, server: Server) {
    console.log(req);
    if (
      server.upgrade(req, {
        data: {
          name: "",
        },
      })
    ) {
      return;
    }

    return new Response("Error");
  },
});

console.log(`http://${server.hostname}:${port}/`);
