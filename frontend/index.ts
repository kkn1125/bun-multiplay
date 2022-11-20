// import App from "./src/core/index";

import { Core, WS } from "./src/core/index";

const canvas = document.querySelector("#app");

const app = new Core({
  el: "#app",
});

const socket = new WS({
  host: import.meta.env.V_HOST || "localhost",
  port: import.meta.env.V_PORT || 3000,
  params: {
    server: 1,
  },
});

setTimeout(() => {
  socket.send("tlqkf");
}, 1000);

app.addSocket(socket);
