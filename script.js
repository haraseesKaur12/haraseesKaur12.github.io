const canvas = document.getElementById("network-canvas");
const ctx = canvas.getContext("2d");
const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

let width = 0;
let height = 0;
let nodes = [];
let packets = [];
let animationFrame = null;

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  createNetwork();
}

function createNetwork() {
  const count = Math.max(14, Math.min(28, Math.floor(width / 55)));
  nodes = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.18,
    vy: (Math.random() - 0.5) * 0.18,
    r: Math.random() * 2.2 + 1.2,
  }));

  packets = Array.from({ length: 9 }, () => createPacket());
}

function createPacket() {
  const from = Math.floor(Math.random() * nodes.length);
  let to = Math.floor(Math.random() * nodes.length);
  while (to === from) {
    to = Math.floor(Math.random() * nodes.length);
  }

  return {
    from,
    to,
    progress: Math.random(),
    speed: 0.0025 + Math.random() * 0.003,
  };
}

function drawNetwork() {
  ctx.clearRect(0, 0, width, height);

  nodes.forEach((node) => {
    node.x += node.vx;
    node.y += node.vy;

    if (node.x < 0 || node.x > width) node.vx *= -1;
    if (node.y < 0 || node.y > height) node.vy *= -1;
  });

  for (let i = 0; i < nodes.length; i += 1) {
    for (let j = i + 1; j < nodes.length; j += 1) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const distance = Math.hypot(dx, dy);

      if (distance < 180) {
        const alpha = 1 - distance / 180;
        ctx.strokeStyle = `rgba(112, 150, 235, ${alpha * 0.18})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.stroke();
      }
    }
  }

  nodes.forEach((node) => {
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(99, 230, 255, 0.72)";
    ctx.fill();
  });

  packets.forEach((packet, index) => {
    const start = nodes[packet.from];
    const end = nodes[packet.to];
    packet.progress += packet.speed;

    if (packet.progress >= 1) {
      packets[index] = createPacket();
      return;
    }

    const x = start.x + (end.x - start.x) * packet.progress;
    const y = start.y + (end.y - start.y) * packet.progress;

    ctx.beginPath();
    ctx.arc(x, y, 3.2, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 209, 102, 0.95)";
    ctx.shadowBlur = 16;
    ctx.shadowColor = "rgba(255, 209, 102, 0.95)";
    ctx.fill();
    ctx.shadowBlur = 0;
  });
}

function animate() {
  drawNetwork();
  animationFrame = window.requestAnimationFrame(animate);
}

function toggleAnimation() {
  if (motionQuery.matches) {
    if (animationFrame) {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }
    drawNetwork();
    return;
  }

  if (!animationFrame) {
    animate();
  }
}

resizeCanvas();
toggleAnimation();

window.addEventListener("resize", resizeCanvas);
motionQuery.addEventListener("change", toggleAnimation);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
document.getElementById("year").textContent = new Date().getFullYear();
