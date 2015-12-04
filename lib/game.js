let BALL_SPEED = 0.01;

export default class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.resizeCanvas();
    window.addEventListener("resize", () => this.resizeCanvas());
    this.side = Math.PI / 2;

    this.players = {
      one: {
        pos: 0.5,
        score: 0,
        key: 0
      },
      two: {
        pos: 0.5,
        score: 0,
        key: -1
      }
    };

    this.resetBall();
  }

  resetBall() {
    this.side = -this.side;
    this.ball = {
      launchDate: Date.now() + 3000,
      x: 0.5,
      y: 0.5,
      a: this.side - Math.PI / 6
    };
  }

  resizeCanvas() {
    this.canvas.height = window.innerHeight;
    this.canvas.width = window.innerWidth;
  }

  update() {
    this.players.one.pos += this.players.one.key / 100;
    this.players.two.pos += this.players.two.key / 100;
    if(this.players.one.pos < 0) this.players.one.pos = 0;
    if(this.players.one.pos > 1) this.players.one.pos = 1;
    if(this.players.two.pos < 0) this.players.two.pos = 0;
    if(this.players.two.pos > 1) this.players.two.pos = 1;

    if(this.ball.launchDate > Date.now()) return;

    this.ball.x += Math.cos(this.ball.a) * BALL_SPEED;
    this.ball.y -= Math.sin(this.ball.a) * BALL_SPEED;

    if(this.ball.y > 1) {
      this.ball.a = -this.ball.a;
      this.ball.y = 1;
    }
    if(this.ball.y < 0) {
      this.ball.a = -this.ball.a;
      this.ball.y = 0;
    }
    if(this.ball.x > 1) {
      if(this.ball.y > this.players.two.y - 1/10
        && this.ball.y < this.players.two.y + 1/10) {
        this.ball.a = Math.PI - this.ball.a;
        this.ball.x = 1;
      } else {
        this.players.one.score++;
        this.resetBall();
      }
    }
    if(this.ball.x < 0) {
      if(this.ball.y > this.players.one.y - 1/10
        && this.ball.y < this.players.one.y + 1/10) {
        this.ball.a = Math.PI - this.ball.a;
        this.ball.x = 0;
      } else {
        this.players.two.score++;
        this.resetBall();
      }
    }
  }

  draw() {
    let h = this.canvas.height, w = this.canvas.width;
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, w, h);

    this.ctx.fillStyle = "white";
    this.ctx.fillRect(
        w / 100,
        (8 * h / 10) * this.players.one.pos,
        w / 50, h / 5
    );
    this.ctx.fillRect(
        w - (w / 50) - (w / 100),
        (8 * h / 10) * this.players.two.pos,
        w / 50, h / 5
    );

    this.ctx.fillRect(
        (9 * w / 10) * this.ball.x - h / 50 + (w / 20),
        (19 * h / 20) * this.ball.y - h / 50 + (h / 40),
        h / 25,
        h / 25
    );

    this.ctx.font = "48px sansserif";
    this.ctx.fillText(this.players.one.score + " - " + this.players.two.score, 20, 60);
  }

  loop() {
    this.update();
    this.draw();
    requestAnimationFrame(() => this.loop());
  }

  playerInput(player, key) {
    this.players[player].key = key;
  }
}
