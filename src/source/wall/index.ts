import * as PIXI from "pixi.js";
import { WIDTH, HEIGHT, STEP_SIZE } from "../../pages/App/index";
function Wall(x: number, y: number) {
  const wall = new PIXI.Text("🧱", {
    fontSize: 12,
    fill: "#fff",
  });
  wall.x = x * STEP_SIZE;
  wall.y = y * STEP_SIZE;
  return wall;
}
export default Wall;
