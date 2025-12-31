// Fireworks effect converted to vanilla JavaScript
class Firework {
  constructor(sx, sy, tx, ty, hue) {
    this.x = sx;
    this.y = sy;
    this.sx = sx;
    this.sy = sy;
    this.tx = tx;
    this.ty = ty;
    this.hue = hue;
    this.brightness = random(50, 70);
    this.distanceToTarget = Math.sqrt(Math.pow(tx - sx, 2) + Math.pow(ty - sy, 2));
    this.distanceTraveled = 0;
    this.coordinates = [];
    this.coordinateCount = 3;
    this.angle = Math.atan2(ty - sy, tx - sx);
    this.speed = 2;
    this.acceleration = 1.05;

    while (this.coordinateCount--) {
      this.coordinates.push([this.x, this.y]);
    }
  }

  update(index) {
    this.coordinates.pop();
    this.coordinates.unshift([this.x, this.y]);

    this.speed *= this.acceleration;
    const vx = Math.cos(this.angle) * this.speed;
    const vy = Math.sin(this.angle) * this.speed;

    this.distanceTraveled = Math.sqrt(Math.pow(this.sx - this.x, 2) + Math.pow(this.sy - this.y, 2));

    if (this.distanceTraveled >= this.distanceToTarget) {
      createParticles(this.tx, this.ty, this.hue);
      fireworks.splice(index, 1);
    } else {
      this.x += vx;
      this.y += vy;
    }
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle = `hsl(${this.hue}, 100%, ${this.brightness}%)`;
    ctx.stroke();
  }
}

class Particle {
  constructor(x, y, hue) {
    this.x = x;
    this.y = y;
    this.coordinates = [];
    this.coordinateCount = 5;
    while (this.coordinateCount--) {
      this.coordinates.push([this.x, this.y]);
    }
    this.hue = random(hue - 20, hue + 20);
    this.angle = random(0, Math.PI * 2);
    this.speed = random(1, 15);
    this.friction = 0.95;
    this.gravity = 1;
    this.brightness = random(50, 80);
    this.alpha = 1;
    this.decay = random(0.005, 0.02);
  }

  update(index) {
    this.coordinates.pop();
    this.coordinates.unshift([this.x, this.y]);
    this.speed *= this.friction;
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed + this.gravity;
    this.alpha -= this.decay;

    if (this.alpha <= this.decay) {
      particles.splice(index, 1);
    }
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.alpha})`;
    ctx.stroke();
  }
}

// Fireworks variables
let canvas;
let ctx;
let width;
let height;
let fireworks = [];
let particles = [];
let hue = 120;
let timerTotal = 30;
let timerTick = 0;
let animationId;

// Helper functions
function random(min, max) {
  return Math.random() * (max - min) + min;
}

function createParticles(x, y, hue) {
  let particleCount = 150;
  while (particleCount--) {
    particles.push(new Particle(x, y, hue));
  }
}

function initFireworks() {
  canvas = document.getElementById('fireworksCanvas');
  ctx = canvas.getContext('2d');
  
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;

  // Start the animation loop
  animateFireworks();
  
  // Handle window resize
  window.addEventListener('resize', handleResize);
}

function animateFireworks() {
  ctx.globalCompositeOperation = 'destination-out';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.fillRect(0, 0, width, height);
  ctx.globalCompositeOperation = 'lighter';

  hue += 0.5;

  // Update and draw fireworks
  let i = fireworks.length;
  while (i--) {
    fireworks[i].draw(ctx);
    fireworks[i].update(i);
  }

  // Update and draw particles
  let j = particles.length;
  while (j--) {
    particles[j].draw(ctx);
    particles[j].update(j);
  }

  // Launch new fireworks
  if (timerTick >= timerTotal) {
    const startX = random(0, width);
    const targetX = random(0, width);
    const targetY = random(0, height / 2);
    
    fireworks.push(new Firework(startX, height, targetX, targetY, hue));
    
    timerTotal = random(15, 40);
    timerTick = 0;
  } else {
    timerTick++;
  }

  animationId = requestAnimationFrame(animateFireworks);
}

function handleResize() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
}

// Initialize the fireworks when the page loads
window.addEventListener('load', initFireworks);
