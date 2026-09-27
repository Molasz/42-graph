import * as THREE from "three";

export function createProceduralPlanetTexture(type, baseColorHex, accentColorHex = "#ffffff") {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");

  const base = new THREE.Color(baseColorHex);
  const accent = new THREE.Color(accentColorHex);

  ctx.fillStyle = `#${base.getHexString()}`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const darker = base.clone().multiplyScalar(0.45);
  const brighter = base.clone().lerp(new THREE.Color("#ffffff"), 0.45);

  if (type === "gas_cyan" || type === "deep_water" || type === "blue_storm") {
    for (let y = 0; y < canvas.height; y += 4) {
      const noise = Math.sin(y * 0.08) * Math.cos(y * 0.03);
      const bandColor = base.clone().lerp(brighter, (Math.sin(y * 0.05 + noise) + 1) * 0.35);
      ctx.fillStyle = `rgba(${Math.floor(bandColor.r * 255)}, ${Math.floor(bandColor.g * 255)}, ${Math.floor(bandColor.b * 255)}, 0.5)`;
      ctx.fillRect(0, y, canvas.width, 4);
    }
    for (let i = 0; i < 8; i++) {
      const cx = (i * 73) % canvas.width;
      const cy = (i * 37) % canvas.height;
      const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, 35);
      grad.addColorStop(0, `rgba(${Math.floor(brighter.r * 255)}, ${Math.floor(brighter.g * 255)}, ${Math.floor(brighter.b * 255)}, 0.7)`);
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, 35, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (type === "cyber_circuit" || type === "chip_asm" || type === "microchip" || type === "circuit_board") {
    ctx.fillStyle = `rgba(${Math.floor(darker.r * 255)}, ${Math.floor(darker.g * 255)}, ${Math.floor(darker.b * 255)}, 0.8)`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = `rgba(${Math.floor(brighter.r * 255)}, ${Math.floor(brighter.g * 255)}, ${Math.floor(brighter.b * 255)}, 0.6)`;
    ctx.lineWidth = 1.5;

    for (let x = 0; x < canvas.width; x += 32) {
      for (let y = 0; y < canvas.height; y += 32) {
        if ((x + y) % 64 === 0) {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + 20, y);
          ctx.lineTo(x + 20, y + 20);
          ctx.stroke();

          ctx.fillStyle = `#${brighter.getHexString()}`;
          ctx.fillRect(x + 18, y + 18, 4, 4);
        }
      }
    }
  } else if (type === "wireframe_mesh" || type === "voxel_grid" || type === "matrix_grid") {
    ctx.strokeStyle = `rgba(${Math.floor(brighter.r * 255)}, ${Math.floor(brighter.g * 255)}, ${Math.floor(brighter.b * 255)}, 0.4)`;
    ctx.lineWidth = 1;
    const step = 24;
    for (let x = 0; x < canvas.width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    for (let i = 0; i < 20; i++) {
      const rx = Math.floor((i * 97) % canvas.width);
      const ry = Math.floor((i * 53) % canvas.height);
      ctx.fillStyle = `rgba(255, 255, 255, 0.7)`;
      ctx.fillRect(rx, ry, step / 2, step / 2);
    }
  } else if (type === "transcendence_crown") {
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, "#09243b");
    grad.addColorStop(0.3, "#0d5c75");
    grad.addColorStop(0.6, "#14b8a6");
    grad.addColorStop(1, "#38bdf8");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < canvas.height; y += 8) {
      ctx.fillStyle = "rgba(255,255,255,0.15)";
      ctx.fillRect(0, y, canvas.width, 2);
    }
    for (let i = 0; i < 30; i++) {
      const px = (i * 61) % canvas.width;
      const py = (i * 29) % canvas.height;
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      ctx.beginPath();
      ctx.arc(px, py, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  } else {
    for (let i = 0; i < 25; i++) {
      const cx = (i * 47) % canvas.width;
      const cy = (i * 31) % canvas.height;
      const r = 8 + (i % 14);
      const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, r);
      grad.addColorStop(0, `rgba(${Math.floor(darker.r * 255)}, ${Math.floor(darker.g * 255)}, ${Math.floor(darker.b * 255)}, 0.6)`);
      grad.addColorStop(0.8, `rgba(${Math.floor(brighter.r * 255)}, ${Math.floor(brighter.g * 255)}, ${Math.floor(brighter.b * 255)}, 0.3)`);
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

export function createSunTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");

  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, "#0d9488");
  grad.addColorStop(0.3, "#14b8a6");
  grad.addColorStop(0.5, "#2dd4bf");
  grad.addColorStop(0.7, "#5eead4");
  grad.addColorStop(1, "#99f6e4");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 40; i++) {
    const cx = (i * 83) % canvas.width;
    const cy = (i * 41) % canvas.height;
    const r = 12 + (i % 24);
    const spotGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, r);
    spotGrad.addColorStop(0, "rgba(255, 255, 255, 0.9)");
    spotGrad.addColorStop(0.5, "rgba(45, 212, 191, 0.5)");
    spotGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = spotGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

export function createRingTexture(colorHex) {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");

  const center = 128;
  const grad = ctx.createRadialGradient(center, center, 40, center, center, 120);
  const color = new THREE.Color(colorHex);

  grad.addColorStop(0, "rgba(0, 0, 0, 0)");
  grad.addColorStop(0.35, "rgba(0, 0, 0, 0)");
  grad.addColorStop(0.45, `rgba(${Math.floor(color.r * 255)}, ${Math.floor(color.g * 255)}, ${Math.floor(color.b * 255)}, 0.8)`);
  grad.addColorStop(0.65, `rgba(${Math.floor(color.r * 255)}, ${Math.floor(color.g * 255)}, ${Math.floor(color.b * 255)}, 0.4)`);
  grad.addColorStop(0.85, `rgba(${Math.floor(color.r * 255)}, ${Math.floor(color.g * 255)}, ${Math.floor(color.b * 255)}, 0.7)`);
  grad.addColorStop(1, "rgba(0, 0, 0, 0)");

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

export function createLabelSprite(text, rankTag, colorHex) {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 72;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "rgba(6, 16, 34, 0.85)";
  const r = 12;
  ctx.beginPath();
  ctx.roundRect(8, 8, canvas.width - 16, canvas.height - 16, r);
  ctx.fill();

  ctx.strokeStyle = colorHex || "#14b8a6";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(8, 8, canvas.width - 16, canvas.height - 16, r);
  ctx.stroke();

  ctx.font = "bold 20px ui-sans-serif, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#ffffff";
  ctx.fillText(text, canvas.width / 2, rankTag ? 30 : 36);

  if (rankTag) {
    ctx.font = "600 13px ui-sans-serif, system-ui, sans-serif";
    ctx.fillStyle = colorHex || "#14b8a6";
    ctx.fillText(rankTag.toUpperCase(), canvas.width / 2, 50);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  const spriteMaterial = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: false,
    depthWrite: false,
  });

  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(16, 4.5, 1);
  return sprite;
}
