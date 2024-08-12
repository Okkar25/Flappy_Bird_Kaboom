kaboom({
  width: 1705,
  height: 956,
  // height: 768,
  scale: 0.9,
  debug: true,
});

loadSprite("bird", "./assets/sprites/bird.png");
loadSprite("bg", "./assets/sprites/bg.png");
loadSprite("pipe", "./assets/sprites/pipe.png");

loadSound("jump", "./assets/sounds/jump.mp3");
loadSound("bruh", "./assets/sounds/bruh.mp3");
loadSound("pass", "./assets/sounds/pass.mp3");

let highScore = 0;

scene("game", () => {
  const PIPE_GAP = 140;
  let score = 0;
  setGravity(1600);

  console.log("Window width:", window.innerWidth);

  add([sprite("bg", { width: width(), height: height() })]);

  const scoreText = add([text("score - " +   score), pos(12, 12)]);

  const player = add([
    sprite("bird"),
    scale(1.2),
    pos(800, 50),
    area(),
    body(),
  ]);

  const createPipes = () => {
    const offset = rand(-50, 50);

    // bottom pipe
    add([
      sprite("pipe"),
      pos(width(), height() / 2 + offset + PIPE_GAP / 2),
      "pipe",
      scale(2),
      area(),
      { passed: false },
    ]);

    // top pipe
    add([
      sprite("pipe", { flipY: true }),
      pos(width(), height() / 2 + offset - PIPE_GAP / 2),
      "pipe",
      anchor("botleft"),
      scale(2),
      area(),
    ]);
  };

  loop(1.5, () => createPipes());

  onUpdate("pipe", (pipe) => {
    pipe.move(-300, 0);

    if (pipe.passed === false && pipe.pos.x < player.pos.x) {
      pipe.passed = true;
      score += 1;
      scoreText.text = "score - " +   score;
      play("pass");
    }
  });

  player.onCollide("pipe", () => {
    const ss = screenshot();
    go("gameover", score, ss);
  });

  player.onUpdate(() => {
    if (player.pos.y > height()) {
      console.log("Player fell off the screen!");
      const ss = screenshot();
      go("gameover", score, ss);
    }
  });

  // To play on desktop
  onKeyPress("space", () => {
    play("jump");
    player.jump(400);
  });

  // To play on mobile (tap on screen)
  window.addEventListener("touchstart", () => {
    play("jump");
    player.jump(400);
  });
});

scene("gameover", (score, screenshot) => {
  if (score > highScore) highScore = score;

  play("bruh");

  loadSprite("gameOverScreen", screenshot);

  add([sprite("bg", { width: width(), height: height() })]); // gameover bg fixed
  add([sprite("gameOverScreen", { width: width(), height: height() })]);

  add([
    text(
      "gameover!\n" +
        "score: " +
        score +
        "\nhigh score: " +
        highScore,
      {
        size: 45,
      }
    ),
    pos(width() / 2 - 170, height() / 3 - 30),
  ]);

  onKeyPress("space", () => {
    go("game");
  });
});

go("game");
