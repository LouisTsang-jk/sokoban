import * as PIXI from "pixi.js";
import { STEP_SIZE } from "../../pages/App/index";
function Box(x: number, y: number) {
  const box = new PIXI.Text("📦", {
    fontSize: 12,
    fill: "#fff",
  });
  box.x = x * STEP_SIZE;
  box.y = y * STEP_SIZE;
  return box;
}
export default Box;
