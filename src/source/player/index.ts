import * as PIXI from "pixi.js";
import { STEP_SIZE } from "../../pages/App/index";
function Player(x: number, y: number) {
  const player = new PIXI.Text("玩家", {
    fontSize: 12,
    fill: "#fff",
  });
  player.x = x * STEP_SIZE;
  player.y = y * STEP_SIZE;
  return player;
}
export default Player;
