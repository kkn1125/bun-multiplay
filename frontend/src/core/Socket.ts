import { generateParamSyntax } from "../assets/utils/tool";

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
  private ws: WebSocket | null = null;

  constructor({ host, port, params }: SocketProps) {
    const parameters = generateParamSyntax(params);
    this.ws = new WebSocket(`ws://${host}:${port}/${params ? parameters : ""}`);
    this.ws.binaryType = "arraybuffer";
    this.ws.onopen = this.open;
    this.ws.onmessage = this.message;
    this.ws.onerror = this.error;
    this.ws.onclose = this.close;
  }

  open(e: any) {
    console.log(e);
  }
  message(message: any) {
    console.log(message);
  }
  error(e: any) {
    console.log(e);
  }
  close(e: any) {
    console.log(e);
  }

  // open: (e) => void;
  // message: (message) => void;
  // error: (error) => void;
  // close: (e) => void;
}

export default Socket;
