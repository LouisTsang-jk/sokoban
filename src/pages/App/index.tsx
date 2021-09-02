import React, { useEffect, useRef, useState } from "react";
import { useKeyPress } from "ahooks";
import img from "../../assets/img/Guy.png";
import * as PIXI from "pixi.js";
import { Graphics } from "pixi.js";
import Player from "../../source/player";
import Box from "../../source/box";
import Wall from "../../source/wall";
import Point from "../../source/point";
import stageConfig from "../../stage/1.json";
import TWEEN from "@tweenjs/tween.js";

export const WIDTH = 640;
export const HEIGHT = 640;
export const STEP_SIZE = 64;
export const ANIMATION_DURING = 80;

enum EnumMapType {
  player = "玩家",
  box = "箱子",
  point = "目标点",
  wall = "墙",
  hit = "目标点[箱子]",
}

type MapType = keyof typeof EnumMapType;

type ReactDirection = "up" | "down" | "left" | "right";

interface MapElement {
  type: MapType;
  data: any;
}

const App: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>();
  const playerRef = useRef<PIXI.Sprite>();
  const [mapInfo, setMapInfo] = useState<MapElement[][]>([[]]);
  const [playerInfo, setPlayerInfo] = useState<[number, number]>([0, 0]);
  const [isVictory, setIsVictory] = useState<boolean>(false);
  const [hitCount, setHitCount] = useState<number>(0);

  function nextPosition(direction: ReactDirection, x: number, y: number) {
    return {
      up: [x, y - 1],
      down: [x, y + 1],
      left: [x - 1, y],
      right: [x + 1, y],
    }[direction];
  }

  function checkNextStep(direction: ReactDirection) {
    //
    const [x, y] = playerInfo;
    const [nextX, nextY] = nextPosition(direction, x, y);
    const nextType = mapInfo[nextX][nextY]?.type;
    const isWall = nextType === "wall";
    const isBox = ["box", "hit"].includes(nextType);
    isBox && console.log("需要移动的位置是箱子");
    isWall && console.log("需要移动的位置是墙");
    if (isBox) {
      const [boxNextX, boxNextY] = nextPosition(direction, nextX, nextY);
      const boxNextType = mapInfo[boxNextX][boxNextY]?.type;
      const isBoxNextWall = ["wall", "box", "hit"].includes(boxNextType);
      isBoxNextWall && console.log("推不动箱子，箱子对面是墙或者箱子");
      const isBoxNextHit = boxNextType === "point";
      const isBoxLeaveHit = nextType === "hit";
      let hitWeight = 0;
      if (isBoxNextHit) hitWeight++;
      if (isBoxLeaveHit) hitWeight--;
      if (isBoxNextWall) {
        return false;
      } else {
        console.log("推动箱子");
        const neoMapInfo = mapInfo;
        const boxEle = neoMapInfo[nextX][nextY].element;
        neoMapInfo[boxNextX][boxNextY] = {
          type: isBoxNextHit ? "hit" : "box",
          element: boxEle,
        };
        setHitCount(hitCount + hitWeight);
        neoMapInfo[nextX][nextY] = {
          type: "player",
          element: playerRef.current,
        };

        boxEle.x = boxNextX * STEP_SIZE;
        boxEle.y = boxNextY * STEP_SIZE;
        setMapInfo(neoMapInfo);
      }
    }
    const canMove = !isWall;
    canMove && setPlayerInfo([nextX, nextY]);
    return canMove;
  }

  function animate(time: number) {
    requestAnimationFrame(animate);
    TWEEN.update(time);
  }

  useKeyPress("ArrowUp", () => {
    // if (checkNextStep("up") && playerRef.current) {
    //   playerRef.current.y -= STEP_SIZE;
    // }
    if (checkNextStep("up") && playerRef.current) {
      const coords = { y: playerRef.current.y };
      new TWEEN.Tween(coords)
        .to({ y: playerRef.current.y - STEP_SIZE }, ANIMATION_DURING)
        .onUpdate(() => {
          if (playerRef.current) playerRef.current.y = coords.y;
        })
        .start();
      requestAnimationFrame(animate);
    }
  });

  useKeyPress("ArrowDown", () => {
    if (checkNextStep("down") && playerRef.current) {
      const coords = { y: playerRef.current.y };
      new TWEEN.Tween(coords)
        .to({ y: playerRef.current.y + STEP_SIZE }, ANIMATION_DURING)
        .onUpdate(() => {
          if (playerRef.current) playerRef.current.y = coords.y;
        })
        .start();
      requestAnimationFrame(animate);
    }
  });

  useKeyPress("ArrowLeft", () => {
    if (checkNextStep("left") && playerRef.current) {
      const coords = { x: playerRef.current.x };
      new TWEEN.Tween(coords)
        .to({ x: playerRef.current.x - STEP_SIZE }, ANIMATION_DURING)
        .onUpdate(() => {
          if (playerRef.current) playerRef.current.x = coords.x;
        })
        .start();
      requestAnimationFrame(animate);
    }
  });

  useKeyPress("ArrowRight", () => {
    if (checkNextStep("right") && playerRef.current) {
      const coords = { x: playerRef.current.x };
      new TWEEN.Tween(coords)
        .to({ x: playerRef.current.x + STEP_SIZE }, ANIMATION_DURING)
        .onUpdate(() => {
          if (playerRef.current) playerRef.current.x = coords.x;
        })
        .start();
      requestAnimationFrame(animate);
    }
  });

  useEffect(() => {
    setIsVictory(hitCount === stageConfig.point.length);
  }, [hitCount]);

  // 初始化程序
  useEffect(() => {
    const app = new PIXI.Application({
      width: WIDTH,
      height: HEIGHT,
      antialias: true,
      resolution: 1,
    });
    containerRef.current?.appendChild(app.view);
    // 绘制网格
    for (let i = 0; i < HEIGHT / STEP_SIZE - 1; i++) {
      const line = new Graphics();
      line.lineStyle(1, 0xffffff, 1);
      line.moveTo(0, 0);
      line.lineTo(0, HEIGHT);
      line.x = STEP_SIZE * (i + 1);
      line.y = 0;
      app.stage.addChild(line);
    }
    for (let i = 0; i < WIDTH / STEP_SIZE - 1; i++) {
      const line = new Graphics();
      line.lineStyle(1, 0xffffff, 1);
      line.moveTo(0, 0);
      line.lineTo(WIDTH, 0);
      line.x = 0;
      line.y = STEP_SIZE * (i + 1);
      app.stage.addChild(line);
    }
    // 维护地图信息
    const mapInfo = new Array(WIDTH / STEP_SIZE - 1);
    for (let i = 0; i < WIDTH / STEP_SIZE - 1; i++) {
      mapInfo[i] = new Array(HEIGHT / STEP_SIZE - 1);
    }
    // 资源初始化
    const { box, wall, point, player } = stageConfig;
    box.forEach((boxPosition) => {
      const [x, y] = boxPosition;
      const box = Box(x, y);
      app.stage.addChild(box);
      mapInfo[x][y] = {
        type: "box",
        element: box,
      };
    });
    wall.forEach((wallPosition) => {
      const [x, y] = wallPosition;
      const wall = Wall(x, y);
      app.stage.addChild(wall);
      mapInfo[x][y] = {
        type: "wall",
        element: wall,
      };
    });
    point.forEach((pointPosition) => {
      const [x, y] = pointPosition;
      const point = Point(x, y);
      app.stage.addChild(point);
      mapInfo[x][y] = {
        type: "point",
        element: point,
      };
    });
    setPlayerInfo([player[0], player[1]]);
    const playerInfo = Player(player[0], player[1]);
    playerRef.current = playerInfo;
    mapInfo[player[0]][player[1]] = {
      type: "player",
      element: playerInfo,
    };
    app.stage.addChild(playerRef.current);
    setMapInfo(mapInfo);
    // gameLoop();
  }, []);

  function gameLoop() {
    requestAnimationFrame(gameLoop);
    console.log("game loop");
  }

  return (
    <>
      <div ref={containerRef}></div>
      <span>
        状态: {`${hitCount}/${stageConfig.point.length}`}(
        {isVictory ? "胜利" : ""})
      </span>
    </>
  );
};

export default App;
