(function () {
  // * Variables
  const canvas = document.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  const scoreEl = document.querySelector('#score');
  const startGameBtn = document.querySelector('#start-game-btn');
  const modalBox = document.querySelector('#modal-box');
  const projectiles = [];
  const enemies = [];
  const particles = [];
  let score = 0;
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
    const velocity = { x: Math.cos(angle) * 4, y: Math.sin(angle) * 4 };

    const projectile = new Projectile(centerX, centerY, 5, '#fff', velocity);

    projectiles.push(projectile);
  };

  const animate = () => {
    animationFrame = window.requestAnimationFrame(animate);
    now = Date.now();
    delta = now - then;

    if (delta > interval) {
      then = now - (delta % interval);

      ctx.fillStyle = 'rgba(0, 0, 0, .1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      player.draw(ctx);

      projectiles.forEach((projectile, i) => {
        projectile.updatePos(ctx);

        if (isProjectileOffScreen(projectile)) {
          setTimeout(() => {
            projectiles.splice(i, 1);
          }, 0);
        }
      });

      enemies.forEach((enemy, enemyIdx) => {
        enemy.updatePos(ctx);

        const distance = Math.hypot(player.x - enemy.x, player.y - enemy.y);

        if (distance - enemy.size - player.size < 1) {
          window.cancelAnimationFrame(animationFrame);
        }

        projectiles.forEach((projectile, projectileIdx) => handleCollision(projectile, projectileIdx, enemy, enemyIdx));
      });

      particles.forEach((particle, i) => {
        if (particle.alpha <= 0) {
          particles.splice(i, 1);
        } else {
          particle.updatePos(ctx);
        }
      });
    }
  };

  const isProjectileOffScreen = ({ x, y, size }) => {
    return x + size < 0 || x - size > canvas.width || y + size < 0 || y - size > canvas.height;
  };

  const handleCollision = (projectile, projectileIdx, enemy, enemyIdx) => {
    const distance = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);

    // when projectile hits enemy target
    if (distance - enemy.size - projectile.size < 1) {
      score += 50;
      scoreEl.textContent = score;
      // create particle explosion on hit
      for (let i = 0; i < enemy.size * 2; i++) {
        const particle = new Particle(projectile.x, projectile.y, Math.random() * 2, enemy.color, {
          x: (Math.random() - 0.5) * Math.random() * 2,
          y: (Math.random() - 0.5) * Math.random() * 2,
        });

        particles.push(particle);
      }

      if (enemy.size - 10 > 5) {
        gsap.to(enemy, {
          size: enemy.size - 10,
        });
        window.setTimeout(() => {
          projectiles.splice(projectileIdx, 1);
        }, 0);
      } else {
        window.setTimeout(() => {
          enemies.splice(enemyIdx, 1);
          projectiles.splice(projectileIdx, 1);
        }, 0);
      }
    }
  };

  const spawnEnemies = () => {
    window.setInterval(() => {
      const size = Math.random() * (25 - 5) + 5;
      const color = `hsl(${Math.random() * 360}, 50%, 50%)`;
      let x, y;

      if (Math.random() < 0.5) {
        x = Math.random() < 0.5 ? 0 - size : canvas.width + size;
        y = Math.random() * canvas.height;
      } else {
        x = Math.random() * canvas.width;
        y = Math.random() < 0.5 ? 0 - size : canvas.height + size;
      }

      const angle = Math.atan2(centerY - y, centerX - x);
      const velocity = { x: Math.cos(angle), y: Math.sin(angle) };

      const enemy = new Enemy(x, y, size, color, velocity);

      enemies.push(enemy);
    }, 750);
  };

  animate();
  spawnEnemies();

  // * Events
  window.addEventListener('DOMContentLoaded', init);
  window.addEventListener('click', handleProjectiles);
})();

class Circle {
  constructor(x, y, size, color) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

class Player extends Circle {
  constructor(x, y, size, color) {
    super(x, y, size, color);
  }
}

class Projectile extends Circle {
  constructor(x, y, size, color, velocity) {
    super(x, y, size, color);
    this.velocity = velocity;
  }

  updatePos(ctx) {
    this.draw(ctx);
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}

class Enemy extends Projectile {
  constructor(x, y, size, color, velocity) {
    super(x, y, size, color, velocity);
  }
}

class Particle extends Projectile {
  constructor(x, y, size, color, velocity) {
    super(x, y, size, color, velocity);
    this.alpha = 1;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
  }

  updatePos(ctx) {
    this.draw(ctx);
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
    this.alpha -= 0.01;
  }
}
