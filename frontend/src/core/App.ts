import { $ } from "../assets/utils/tool";

interface AppEntity {
  setupModel: () => void;
  setupMap: () => void;
  render: (time: number) => void;
}

class App implements AppEntity {
  private canvas: HTMLCanvasElement | null;

  constructor(el: string) {
    this.canvas = $(el || "#app") as HTMLCanvasElement;

    requestAnimationFrame(this.render.bind(this));
  }

  setupModel() {}

  setupMap() {}

  render(time: number) {
    const frame = time / 1000;

    requestAnimationFrame(this.render.bind(this));
  }
}

export default App;
