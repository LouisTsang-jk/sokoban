import * as PIXI from "pixi.js";
import { STEP_SIZE } from "../../pages/App/index";
function Point(x: number, y: number) {
  const point = new PIXI.Text("目标点", {
    fontSize: 12,
    fill: "#fff",
  });
  point.x = x * STEP_SIZE;
  point.y = y * STEP_SIZE;
  return point;
}
export default Point;
