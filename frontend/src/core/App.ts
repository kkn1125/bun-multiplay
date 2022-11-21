import { $ } from "../assets/utils/tool";
import Socket from "./Socket";

interface AppEntity {
  setupModel: () => void;
  setupMap: (map: string) => void;
  render: (time: number) => void;
}

interface User {
  id: number;
  nickname: string;
  x: number;
  y: number;
  size: {
    x: number;
    y: number;
  };
  jump: boolean;
}

const SIZE = {
  user: {
    x: 30,
    y: 30,
  },
  pixel: 50,
};

const SPEED = 5;
const direction: { [key: string]: boolean } = {};
let id = 0;
let moving = false;
let ws: Socket;

class App implements AppEntity {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private scene: User[] = [];
  private sockets = new Map();
  private map: number[][] = [[]];
  private gravity: number = 3;
  private ACCEL: number = 3;
  private accelerate: number = 5;
  private maxJumpSize: number = SIZE.pixel * 2;
  private basePosition = {
    x: 50,
    y: SIZE.pixel * 2,
  };
  private initialPosition = {
    x: this.basePosition.x - SIZE.user.x,
    y: this.basePosition.y - SIZE.user.y,
  };

  constructor(el: string) {
    this.canvas = $(el || "canvas#app") as HTMLCanvasElement;
    if (this.canvas) {
      this.canvas.width = innerWidth;
      this.canvas.height = innerHeight;
    }
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;

    requestAnimationFrame(this.render.bind(this));
  }

  initialize() {
    this.setupEvents();
    // this.setupModel();
    // this.setupMap(map);
  }

  addSocket(socket: Socket) {
    ws = socket;
    this.sockets.set(ws, id);
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
    const code = e.code.toLowerCase();
    if (
      key === "w" ||
      key === "a" ||
      key === "s" ||
      key === "d" ||
      key === "shift" ||
      code === "space"
    ) {
      e.preventDefault();
      direction[code === "space" ? code : key] = true;
    }
  }

  handleDeactiveDirection(e: KeyboardEvent) {
    const key = e.key.toLowerCase();
    const code = e.code.toLowerCase();
    if (
      key === "w" ||
      key === "a" ||
      key === "s" ||
      key === "d" ||
      key === "shift" ||
      code === "space"
    ) {
      e.preventDefault();
      direction[code === "space" ? code : key] = false;
    }
  }

  setupEvents() {
    window.addEventListener("resize", this.handleResize);
    window.addEventListener("keydown", this.handleActiveDirection);
    window.addEventListener("keyup", this.handleDeactiveDirection);
  }

  setupModel() {
    this.scene.push({
      id: this.sockets.get(ws),
      nickname: "test",
      x: this.initialPosition.x,
      y: this.initialPosition.y,
      size: {
        x: SIZE.user.x,
        y: SIZE.user.y,
      },
      jump: false,
    });
  }

  setupMap(map: string) {
    this.map = map
      .trim()
      .split(/[^\d]+/)
      .map((level) => level.split("").map((pixel) => Number(pixel)));
  }

  setGravity(gravity = 2) {
    this.gravity = gravity;
  }

  setAccelerate(accelerate = 5) {
    this.accelerate = accelerate;
  }

  renderMap() {
    for (let levelIndex in this.map) {
      for (let pixelIndex in this.map[levelIndex]) {
        const pixel = this.map[levelIndex][pixelIndex];
        if (pixel === 0) {
          continue;
        }
        this.ctx.fillRect(
          Number(pixelIndex) * SIZE.pixel,
          Number(levelIndex) * SIZE.pixel,
          SIZE.pixel,
          SIZE.pixel
        );
      }
    }
  }

  clear() {
    this.ctx.clearRect(0, 0, innerWidth, innerHeight);
  }

  update(frame: number) {
    const user = this.scene.find((user) => user.id === this.sockets.get(ws));
    const baseline = (this.map.length - 1) * SIZE.pixel - SIZE.user.y;
    if (user) {
      if (
        direction.w ||
        direction.a ||
        direction.s ||
        direction.d ||
        direction.space
      ) {
        // if (direction.w) {
        //   user.y -= SPEED;
        // }
        if (direction.a) {
          user.x -= SPEED;
        }
        // if (direction.s) {
        //   user.y += SPEED;
        // }
        if (direction.d) {
          user.x += SPEED;
        }

        if (direction.space) {
          if (!user.jump && this.isGround(user.y)) {
            user.jump = true;
          }
        }
      }

      if (user.jump) {
        if (user.y < baseline - this.maxJumpSize) {
          console.log("범위 초과");
          user.jump = false;
        } else {
          user.y -= (this.accelerate ^ 2) * this.gravity - this.gravity;
          this.accelerate -= this.ACCEL * this.accelerate * 0.01;
          if (this.accelerate < 0 || user.y < baseline - this.maxJumpSize) {
            user.jump = false;
            this.accelerate = 0;
          }
        }
      }
      if (!user.jump && user.y < baseline) {
        user.y += this.accelerate * this.gravity + 5;
        this.accelerate += this.ACCEL * this.accelerate * 0.0001;
        if (this.accelerate > 5) {
          this.accelerate = 5;
        }
        if (this.accelerate < this.ACCEL) {
          this.accelerate = 5;
        }
        if (user.y > baseline) {
          user.y = baseline;
          this.accelerate = 5;
          if (user.jump) {
            user.jump = false;
          }
        }
      }
    }

    for (let i = 0; i < this.scene.length; i++) {
      this.ctx.fillRect(
        this.scene[i].x,
        this.scene[i].y,
        this.scene[i].size.x,
        this.scene[i].size.y
      );
    }
  }

  isGround(y: number) {
    const baseline = (this.map.length - 1) * SIZE.pixel - SIZE.user.y;
    return y === baseline;
  }

  render(time: number) {
    const frame = time * 0.001;

    this.clear();
    this.renderMap();
    this.update(frame);

    requestAnimationFrame(this.render.bind(this));
  }
}

export default App;
