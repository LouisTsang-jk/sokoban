import * as PIXI from "pixi.js";
import { STEP_SIZE } from "../../pages/App/index";
function Hit(x: number, y: number) {
  const hit = new PIXI.Text("命中", {
    fontSize: 12,
    fill: "#fff",
  });
  hit.x = x * STEP_SIZE;
  hit.y = y * STEP_SIZE;
  return hit;
}
export default Hit;
