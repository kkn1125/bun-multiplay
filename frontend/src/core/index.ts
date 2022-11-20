import App from "./App";
import Socket from "./Socket";

const WS = Socket;

class Core extends App {
  constructor(data: { el: string }) {
    super(data.el);
  }
}

export { Core, WS };
