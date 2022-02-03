(function () {
  // * Variables
  const canvas = document.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  let player = null;
  let projectiles = [];
  let centerX;
  let centerY;

  // * Methods
  const init = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    centerX = canvas.width / 2;
    centerY = canvas.height / 2;

    playerSetup();
  };

  const playerSetup = (_e) => {
    player = new Player(centerX, centerY, 25, 'aqua');
    player.draw(ctx);
  };

  const handleProjectiles = (e) => {
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;

    const angle = Math.atan2(distanceY, distanceX);
    const velocity = { x: Math.cos(angle), y: Math.sin(angle) };

    const projectile = new Projectile(centerX, centerY, 5, 'red', velocity);

    projectiles.push(projectile);
    animate();
  };

  const animate = () => {
    const fps = 25;

    setTimeout(() => {
      requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      player.draw(ctx);
      projectiles.forEach((projectile) => {
        projectile.updatePosition(ctx);
      });
    }, 1000 / fps);
  };

  // * Events
  addEventListener('DOMContentLoaded', init);
  addEventListener('click', handleProjectiles);
})();

class Circle {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

class Player extends Circle {
  constructor(x, y, radius, color) {
    super(x, y, radius, color);
  }
}

class Projectile extends Circle {
  constructor(x, y, radius, color, velocity) {
    super(x, y, radius, color);
    this.velocity = velocity;
  }

  updatePosition(ctx) {
    this.draw(ctx);

    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}
