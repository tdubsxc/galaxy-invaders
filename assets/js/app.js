(function () {
  // * Variables
  const canvas = document.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  const projectiles = [];
  const enemies = [];
  let player = null;
  let centerX, centerY, animationFrame;

  let fps = 200;
  let now = null;
  let then = Date.now();
  let interval = 1000 / fps;
  let delta = null;

  // * Methods
  const init = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    centerX = canvas.width / 2;
    centerY = canvas.height / 2;

    playerSetup();
  };

  const playerSetup = (_e) => {
    player = new Player(centerX, centerY, 15, '#fff');
    player.draw(ctx);
  };

  const handleProjectiles = (e) => {
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;

    const angle = Math.atan2(distanceY, distanceX);
    const velocity = { x: Math.cos(angle), y: Math.sin(angle) };

    const projectile = new Projectile(centerX, centerY, 5, '#fff', velocity);

    projectiles.push(projectile);
  };

  const animate = () => {
    animationFrame = requestAnimationFrame(animate);
    now = Date.now();
    delta = now - then;

    if (delta > interval) {
      then = now - (delta % interval);

      ctx.fillStyle = 'rgba(0, 0, 0, .1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      player.draw(ctx);

      projectiles.forEach((projectile, i) => {
        projectile.updatePosition(ctx);

        if (isProjectileOffScreen(projectile)) {
          setTimeout(() => {
            projectiles.splice(i, 1);
          }, 0);
        }
      });

      enemies.forEach((enemy, enemyIdx) => {
        enemy.updatePosition(ctx);

        const distance = Math.hypot(player.x - enemy.x, player.y - enemy.y);

        if (distance - enemy.radius - player.radius < 1) {
          cancelAnimationFrame(animationFrame);
        }

        projectiles.forEach((projectile, projectileIdx) => handleCollision(projectile, projectileIdx, enemy, enemyIdx));
      });
    }
  };

  const isProjectileOffScreen = ({ x, y, radius }) => {
    return x + radius < 0 || x - radius > canvas.width || y + radius < 0 || y - radius > canvas.height;
  };

  const handleCollision = (projectile, projectileIdx, enemy, enemyIdx) => {
    const distance = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);

    if (distance - enemy.radius - projectile.radius < 1) {
      setTimeout(() => {
        enemies.splice(enemyIdx, 1);
        projectiles.splice(projectileIdx, 1);
      }, 0);
    }
  };

  const spawnEnemies = () => {
    setInterval(() => {
      const radius = Math.random() * (25 - 5) + 5;
      const color = 'purple';
      let x, y;

      if (Math.random() < 0.5) {
        x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
        y = Math.random() * canvas.height;
      } else {
        x = Math.random() * canvas.width;
        y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
      }

      const angle = Math.atan2(centerY - y, centerX - x);
      const velocity = { x: Math.cos(angle), y: Math.sin(angle) };

      const enemy = new Enemy(x, y, radius, color, velocity);

      enemies.push(enemy);
    }, 2000);
  };

  animate();
  spawnEnemies();

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

class Enemy extends Projectile {
  constructor(x, y, radius, color, velocity) {
    super(x, y, radius, color, velocity);
  }
}
