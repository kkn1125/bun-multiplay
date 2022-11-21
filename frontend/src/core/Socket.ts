import { generateParamSyntax } from "../assets/utils/tool";
import dev from "./dev";

let isFirst = false;

interface SocketEntity {
  open: (e: any) => void;
  message: (message: any) => void;
  error: (e: any) => void;
  close: (e: any) => void;
}

interface SocketProps {
  host: string;
  port: string | number;
  params: string | object;
}

class Socket implements SocketEntity {
  private host: string;
  private port: string | number;
  private params: string | object;
  private parameters: string | undefined;
  private ws: WebSocket | null = null;

  constructor({ host, port, params }: SocketProps) {
    this.host = host;
    this.port = port;
    this.params = params;
    try {
      this.parameters = generateParamSyntax(params);
    } catch (e) {
      throw new Error("not available the parameter's key or value");
    }
  }

  getConnection() {
    if (isFirst) {
      dev.log("socket re-connection");
    }
    if (!isFirst) {
      dev.log("socket fisrt-connection");
      isFirst = true;
    }
    this.ws = new WebSocket(
      `ws://${this.host}:${this.port}/${this.parameters}`
    );
    this.ws.binaryType = "arraybuffer";
    this.ws.onopen = this.open.bind(this);
    this.ws.onmessage = this.message.bind(this);
    this.ws.onerror = this.error.bind(this);
    this.ws.onclose = this.close.bind(this);
  }

  open(e: any) {
    // dev.log(e);
    this.send("test open");
  }
  message(message: any) {
    dev.log(message);
  }
  error(e: any) {
    // dev.log(e);
    dev.log("error!");
    this.getConnection.call(this);
  }
  close(e: any) {
    // dev.log(e);
    dev.log("close!");
    this.getConnection.call(this);
  }

  send(data: string | ArrayBufferLike | Blob | ArrayBufferView) {
    this.ws?.send(data);
  }

  // open: (e) => void;
  // message: (message) => void;
  // error: (error) => void;
  // close: (e) => void;
}

export default Socket;
