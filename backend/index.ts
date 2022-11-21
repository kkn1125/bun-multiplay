import { serve, Server, ServerWebSocket } from "bun";

const port = Number(process.env.SOCKET_PORT) || 3000;

const server = serve({
  port: port,
  websocket: {
    open(ws) {
      console.log("connection!");
      ws.subscribe("broadcast");
      ws.sendText("server connect");
    },
    message(ws, message) {
      console.log(ws);
      console.log(message);
    },
    drain(ws) {
      console.log(ws);
    },
    close(ws) {
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
