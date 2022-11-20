import { $ } from "../assets/utils/tool";
import Socket from "./Socket";

interface AppEntity {
  setupModel: () => void;
  setupMap: () => void;
  render: (time: number) => void;
}

// interface Scene {
//   [key: number]: object;
// }

class Scene extends Array {
  // #stack: any[] = [];
  add(...args: any[]) {
    this.push(...args);
  }

  // out() {
  //   return this.#stack;
  // }

  size() {
    return this.length;
  }
}

const SIZE = {
  x: 30,
  y: 30,
};

const initialPosition = {
  x: innerWidth / 2 - SIZE.x,
  y: innerHeight / 2 - SIZE.y,
};

const SPEED = 5;
const direction: { [key: string]: boolean } = {};
let id = 0;
let moving = false;
let ws: Socket;

class App implements AppEntity {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private scene = new Scene();
  private sockets = new Map();

  constructor(el: string) {
    this.canvas = $(el || "canvas#app") as HTMLCanvasElement;
    if (this.canvas) {
      this.canvas.width = innerWidth;
      this.canvas.height = innerHeight;
    }
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.setupEvents();
    requestAnimationFrame(this.render.bind(this));
  }

  addSocket(socket: Socket) {
    ws = socket;
    this.sockets.set(ws, id);
    this.setupModel();
    id++;
  }

  handleResize(e: Event) {
    e.preventDefault();
    if (this.canvas) {
      this.canvas.width = innerWidth;
      this.canvas.height = innerHeight;
    }
  }

  handleActiveDirection(e: KeyboardEvent) {
    const key = e.key.toLowerCase();
    if (
      key === "w" ||
      key === "a" ||
      key === "s" ||
      key === "d" ||
      key === "shift"
    ) {
      e.preventDefault();
      direction[e.key.toLowerCase()] = true;
    }
  }

  handleDeactiveDirection(e: KeyboardEvent) {
    const key = e.key.toLowerCase();
    if (
      key === "w" ||
      key === "a" ||
      key === "s" ||
      key === "d" ||
      key === "shift"
    ) {
      e.preventDefault();
      direction[e.key.toLowerCase()] = false;
    }
  }

  setupEvents() {
    window.addEventListener("resize", this.handleResize);
    window.addEventListener("keydown", this.handleActiveDirection);
    window.addEventListener("keyup", this.handleDeactiveDirection);
  }

  setupModel() {
    this.scene.add({
      id: this.sockets.get(ws),
      nickname: "test",
      x: initialPosition.x,
      y: initialPosition.y,
      size: {
        x: SIZE.x,
        y: SIZE.y,
      },
    });
  }

  setupMap() {}

  clear() {
    this.ctx.clearRect(0, 0, innerWidth, innerHeight);
  }

  update() {
    const user = this.scene.find((user) => user.id === this.sockets.get(ws));

    if (user) {
      if (direction.w || direction.a || direction.s || direction.d) {
        if (direction.w) {
          user.y -= SPEED;
        }
        if (direction.a) {
          user.x -= SPEED;
        }
        if (direction.s) {
          user.y += SPEED;
        }
        if (direction.d) {
          user.x += SPEED;
        }
      }
    }

    for (let i = 0; i < this.scene.size(); i++) {
      this.ctx.fillRect(
        this.scene[i].x,
        this.scene[i].y,
        this.scene[i].size.x,
        this.scene[i].size.y
      );
    }
  }

  render(time: number) {
    const frame = time / 1000;

    this.clear();
    this.update();

    requestAnimationFrame(this.render.bind(this));
  }
}

export default App;
