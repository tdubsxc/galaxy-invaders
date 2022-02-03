class App {
  constructor() {
    this.canvas = document.querySelector('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.user = null;
  }

  init() {
    this.events();
  }

  events() {
    window.addEventListener('DOMContentLoaded', (_e) => {
      this.setCanvasDimensions();
      this.createUser();
    });
  }

  setCanvasDimensions() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createUser() {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;

    this.user = new User(centerX, centerY, 25, 'aqua');
    const { x, y, radius, color } = this.user;

    this.draw(x, y, radius, color);
  }

  draw(x, y, r, color) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, r, 0, Math.PI * 2, false);
    this.ctx.fillStyle = color;
    this.ctx.fill();
  }
}

class User {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }
}

const app = new App();
app.init();
