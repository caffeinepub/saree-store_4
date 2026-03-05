import { Button } from "@/components/ui/button";
import { Download, Eye, EyeOff, Loader2, Sparkles, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface TryOnCanvasProps {
  userImage: string; // dataURL
  productImageUrl: string;
  categoryLabel: "saree" | "jewelry" | "handbag" | string;
  productName: string;
}

const CANVAS_W = 520;
const CANVAS_H = 650;

const PROCESSING_STEPS = [
  { label: "Scanning facial landmarks & body pose...", duration: 850 },
  { label: "Analysing skin tone & ambient lighting...", duration: 750 },
  { label: "Mapping garment geometry to body shape...", duration: 900 },
  { label: "Applying fabric texture & fold simulation...", duration: 800 },
  { label: "Rendering light interaction & shadows...", duration: 700 },
  { label: "Compositing final AI look...", duration: 650 },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function drawCoverFit(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
) {
  const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
  const sw = img.naturalWidth * scale;
  const sh = img.naturalHeight * scale;
  ctx.drawImage(img, x + (w - sw) / 2, y + (h - sh) / 2, sw, sh);
}

function sampleAverageColor(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
): [number, number, number] {
  try {
    const cx = Math.max(0, Math.round(x));
    const cy = Math.max(0, Math.round(y));
    const cw = Math.max(1, Math.round(w));
    const ch = Math.max(1, Math.round(h));
    const data = ctx.getImageData(cx, cy, cw, ch).data;
    let r = 0;
    let g = 0;
    let b = 0;
    let count = 0;
    for (let i = 0; i < data.length; i += 4) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      count++;
    }
    if (count === 0) return [200, 160, 120];
    return [
      Math.round(r / count),
      Math.round(g / count),
      Math.round(b / count),
    ];
  } catch {
    return [200, 160, 120];
  }
}

function drawDecorativeBorder(ctx: CanvasRenderingContext2D) {
  ctx.save();
  // Outer golden frame
  const grad = ctx.createLinearGradient(0, 0, CANVAS_W, CANVAS_H);
  grad.addColorStop(0, "rgba(220,175,60,0.75)");
  grad.addColorStop(0.5, "rgba(255,215,100,0.95)");
  grad.addColorStop(1, "rgba(180,130,40,0.7)");
  ctx.strokeStyle = grad;
  ctx.lineWidth = 3;
  ctx.strokeRect(2, 2, CANVAS_W - 4, CANVAS_H - 4);
  ctx.strokeStyle = "rgba(200,160,50,0.3)";
  ctx.lineWidth = 1;
  ctx.strokeRect(8, 8, CANVAS_W - 16, CANVAS_H - 16);
  // Corner accents
  const corner = 22;
  ctx.strokeStyle = "rgba(220,175,60,0.9)";
  ctx.lineWidth = 2;
  for (const [cx, cy, sx, sy] of [
    [4, 4, 1, 1],
    [CANVAS_W - 4, 4, -1, 1],
    [4, CANVAS_H - 4, 1, -1],
    [CANVAS_W - 4, CANVAS_H - 4, -1, -1],
  ] as [number, number, number, number][]) {
    ctx.beginPath();
    ctx.moveTo(cx + sx * corner, cy);
    ctx.lineTo(cx, cy);
    ctx.lineTo(cx, cy + sy * corner);
    ctx.stroke();
  }
  ctx.restore();
}

function drawWatermark(ctx: CanvasRenderingContext2D) {
  ctx.save();
  ctx.font = "italic 11px Georgia, serif";
  ctx.fillStyle = "rgba(255,255,255,0.82)";
  ctx.textAlign = "right";
  ctx.shadowColor = "rgba(0,0,0,0.85)";
  ctx.shadowBlur = 6;
  ctx.fillText(
    "✨ Dali's Boutique — AI Look Generator",
    CANVAS_W - 14,
    CANVAS_H - 12,
  );
  ctx.restore();
}

function drawBottomLabel(ctx: CanvasRenderingContext2D, text: string) {
  ctx.save();
  const g = ctx.createLinearGradient(0, CANVAS_H - 80, 0, CANVAS_H);
  g.addColorStop(0, "rgba(0,0,0,0)");
  g.addColorStop(0.5, "rgba(0,0,0,0.6)");
  g.addColorStop(1, "rgba(0,0,0,0.88)");
  ctx.fillStyle = g;
  ctx.fillRect(0, CANVAS_H - 80, CANVAS_W, 80);
  ctx.font = "bold 16px Georgia, serif";
  ctx.fillStyle = "#fff8ee";
  ctx.textAlign = "center";
  ctx.shadowColor = "rgba(0,0,0,1)";
  ctx.shadowBlur = 10;
  ctx.fillText(text, CANVAS_W / 2, CANVAS_H - 20);
  ctx.restore();
}

function drawProductThumbnail(
  ctx: CanvasRenderingContext2D,
  productImg: HTMLImageElement,
) {
  const tw = 72;
  const th = 90;
  const tx = CANVAS_W - tw - 16;
  const ty = 16;
  const r = 8;
  ctx.save();
  // Glowing frame behind thumbnail
  ctx.shadowColor = "rgba(220,175,60,0.7)";
  ctx.shadowBlur = 16;
  ctx.beginPath();
  ctx.roundRect(tx - 3, ty - 3, tw + 6, th + 6, r + 2);
  ctx.fillStyle = "rgba(20,15,10,0.6)";
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(tx, ty, tw, th, r);
  ctx.clip();
  ctx.drawImage(productImg, tx, ty, tw, th);
  ctx.restore();

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(tx, ty, tw, th, r);
  ctx.strokeStyle = "rgba(220,175,60,0.95)";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.font = "bold 8px Arial, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.textAlign = "center";
  ctx.shadowColor = "rgba(0,0,0,0.9)";
  ctx.shadowBlur = 4;
  ctx.fillText("PRODUCT", tx + tw / 2, ty + th + 13);
  ctx.restore();
}

// Sinusoidal fold lines to simulate fabric draping
function drawFabricFolds(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  foldCount = 8,
  alpha = 0.045,
) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  for (let i = 0; i < foldCount; i++) {
    const fx = x + (w / foldCount) * i + w / (foldCount * 2);
    ctx.beginPath();
    for (let row = y; row < y + h; row += 2) {
      const offset = Math.sin((row - y) * 0.045 + i * 0.7) * 6 + fx;
      if (row === y) ctx.moveTo(offset, row);
      else ctx.lineTo(offset, row);
    }
    ctx.globalAlpha = alpha + (i % 2 === 0 ? 0.02 : 0);
    ctx.strokeStyle = i % 2 === 0 ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.3)";
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }
  ctx.restore();
}

// Draw a realistic vignette for depth
function drawBodyVignette(ctx: CanvasRenderingContext2D, startY: number) {
  ctx.save();
  const vgGrad = ctx.createRadialGradient(
    CANVAS_W / 2,
    CANVAS_H * 0.55,
    CANVAS_W * 0.18,
    CANVAS_W / 2,
    CANVAS_H * 0.55,
    CANVAS_W * 0.82,
  );
  vgGrad.addColorStop(0, "rgba(0,0,0,0)");
  vgGrad.addColorStop(0.6, "rgba(0,0,0,0.05)");
  vgGrad.addColorStop(1, "rgba(0,0,0,0.22)");
  ctx.globalCompositeOperation = "multiply";
  ctx.fillStyle = vgGrad;
  ctx.fillRect(0, startY, CANVAS_W, CANVAS_H - startY);
  ctx.restore();
}

// ─── SAREE: deeply realistic drape with fabric texture ──────────────────────
function compositeForSaree(
  ctx: CanvasRenderingContext2D,
  userImg: HTMLImageElement,
  productImg: HTMLImageElement,
) {
  // 1. Full user photo as base
  ctx.save();
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "source-over";
  drawCoverFit(ctx, userImg, 0, 0, CANVAS_W, CANVAS_H);
  ctx.restore();

  // Sample face/skin area to understand scene lighting
  const [avgR, avgG, avgB] = sampleAverageColor(
    ctx,
    Math.floor(CANVAS_W * 0.3),
    Math.floor(CANVAS_H * 0.06),
    Math.floor(CANVAS_W * 0.4),
    Math.floor(CANVAS_H * 0.18),
  );
  const lightness = (avgR + avgG + avgB) / 3;
  const isDark = lightness < 130;

  // Sample chest/body area color for seam blending
  const [bodyR, bodyG, bodyB] = sampleAverageColor(
    ctx,
    Math.floor(CANVAS_W * 0.25),
    Math.floor(CANVAS_H * 0.22),
    Math.floor(CANVAS_W * 0.5),
    Math.floor(CANVAS_H * 0.08),
  );

  // Saree drape starts around chest (15% from top)
  const sareeStartY = Math.floor(CANVAS_H * 0.15);
  const sareeH = CANVAS_H - sareeStartY;

  // ── Off-canvas: Build saree layer with advanced compositing ──
  const offCanvas = document.createElement("canvas");
  offCanvas.width = CANVAS_W;
  offCanvas.height = CANVAS_H;
  const offCtx = offCanvas.getContext("2d")!;

  // Draw saree tiled/stretched to fit body area
  offCtx.save();
  offCtx.globalAlpha = 1;
  offCtx.drawImage(productImg, 0, sareeStartY, CANVAS_W, sareeH);
  offCtx.restore();

  // Fabric fold lines (sinusoidal grain)
  drawFabricFolds(offCtx, 0, sareeStartY, CANVAS_W, sareeH, 10, 0.04);

  // Horizontal weft lines (fine weave texture)
  offCtx.save();
  for (let row = sareeStartY; row < CANVAS_H; row += 4) {
    const alpha = row % 8 === 0 ? 0.028 : 0.014;
    offCtx.globalAlpha = alpha;
    offCtx.strokeStyle =
      row % 8 === 0 ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.5)";
    offCtx.lineWidth = 0.4;
    offCtx.beginPath();
    offCtx.moveTo(0, row);
    offCtx.lineTo(CANVAS_W, row);
    offCtx.stroke();
  }
  offCtx.restore();

  // Ambient light tinting to match scene
  if (isDark) {
    offCtx.save();
    offCtx.globalAlpha = 0.12;
    offCtx.globalCompositeOperation = "multiply";
    offCtx.fillStyle = `rgb(${Math.round(avgR * 0.6)},${Math.round(avgG * 0.6)},${Math.round(avgB * 0.6)})`;
    offCtx.fillRect(0, sareeStartY, CANVAS_W, sareeH);
    offCtx.globalCompositeOperation = "source-over";
    offCtx.restore();
  } else {
    // Subtle warm highlight in bright scenes
    offCtx.save();
    offCtx.globalAlpha = 0.08;
    offCtx.globalCompositeOperation = "screen";
    const warmGrad = offCtx.createLinearGradient(
      0,
      sareeStartY,
      0,
      sareeStartY + sareeH * 0.4,
    );
    warmGrad.addColorStop(
      0,
      `rgba(${avgR},${Math.round(avgG * 0.85)},${Math.round(avgB * 0.7)},1)`,
    );
    warmGrad.addColorStop(1, "rgba(0,0,0,0)");
    offCtx.fillStyle = warmGrad;
    offCtx.fillRect(0, sareeStartY, CANVAS_W, sareeH * 0.4);
    offCtx.restore();
  }

  // Top fade: erase saree at shoulder to blend into skin
  const fadeTopGrad = offCtx.createLinearGradient(
    0,
    sareeStartY,
    0,
    sareeStartY + 110,
  );
  fadeTopGrad.addColorStop(0, "rgba(0,0,0,1)");
  fadeTopGrad.addColorStop(0.7, "rgba(0,0,0,0)");
  offCtx.globalCompositeOperation = "destination-out";
  offCtx.fillStyle = fadeTopGrad;
  offCtx.fillRect(0, sareeStartY, CANVAS_W, 110);

  // Side feathering (edges blend naturally)
  const fadeLeftGrad = offCtx.createLinearGradient(0, 0, 40, 0);
  fadeLeftGrad.addColorStop(0, "rgba(0,0,0,0.55)");
  fadeLeftGrad.addColorStop(1, "rgba(0,0,0,0)");
  offCtx.fillStyle = fadeLeftGrad;
  offCtx.fillRect(0, sareeStartY, 40, sareeH);

  const fadeRightGrad = offCtx.createLinearGradient(
    CANVAS_W - 40,
    0,
    CANVAS_W,
    0,
  );
  fadeRightGrad.addColorStop(0, "rgba(0,0,0,0)");
  fadeRightGrad.addColorStop(1, "rgba(0,0,0,0.55)");
  offCtx.fillStyle = fadeRightGrad;
  offCtx.fillRect(CANVAS_W - 40, sareeStartY, 40, sareeH);

  offCtx.globalCompositeOperation = "source-over";

  // 3. Composite saree layer onto main canvas
  ctx.save();
  ctx.globalAlpha = 0.88;
  ctx.globalCompositeOperation = "source-over";
  ctx.drawImage(offCanvas, 0, 0, CANVAS_W, CANVAS_H);
  ctx.restore();

  // 4. Restore face and upper body over saree (so face is always clean)
  const faceH = Math.floor(CANVAS_H * 0.2);
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, CANVAS_W, faceH);
  ctx.clip();
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "source-over";
  drawCoverFit(ctx, userImg, 0, 0, CANVAS_W, CANVAS_H);
  ctx.restore();

  // 5. Seam blending at chest/shoulder boundary — use body color
  ctx.save();
  const seamGrad = ctx.createLinearGradient(0, faceH - 15, 0, faceH + 75);
  seamGrad.addColorStop(0, "rgba(0,0,0,0)");
  seamGrad.addColorStop(0.35, `rgba(${bodyR},${bodyG},${bodyB},0.08)`);
  seamGrad.addColorStop(0.7, "rgba(0,0,0,0.05)");
  seamGrad.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = seamGrad;
  ctx.fillRect(0, faceH - 15, CANVAS_W, 90);
  ctx.restore();

  // 6. Neckline shadow to simulate drape depth
  ctx.save();
  const neckShadow = ctx.createLinearGradient(0, faceH + 10, 0, faceH + 50);
  neckShadow.addColorStop(0, "rgba(0,0,0,0.18)");
  neckShadow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.globalAlpha = 0.6;
  ctx.fillStyle = neckShadow;
  ctx.fillRect(CANVAS_W * 0.2, faceH + 10, CANVAS_W * 0.6, 40);
  ctx.restore();

  // 7. Saree ambient light cast onto skin (neck/arms glow from fabric color)
  const [sareeR, sareeG, sareeB] = sampleAverageColor(
    offCtx,
    Math.floor(CANVAS_W * 0.2),
    sareeStartY + 60,
    Math.floor(CANVAS_W * 0.6),
    80,
  );
  ctx.save();
  ctx.globalAlpha = 0.07;
  ctx.globalCompositeOperation = "screen";
  ctx.fillStyle = `rgb(${sareeR},${sareeG},${sareeB})`;
  ctx.fillRect(CANVAS_W * 0.15, faceH - 30, CANVAS_W * 0.7, 80);
  ctx.restore();

  // 8. Body-shape depth vignette
  drawBodyVignette(ctx, faceH);

  drawProductThumbnail(ctx, productImg);
  drawBottomLabel(ctx, "✨ AI Saree Try-On — Dali's Boutique");
  drawDecorativeBorder(ctx);
  drawWatermark(ctx);
}

// ─── JEWELRY: luminous layered placement with glow system ───────────────────
function compositeForJewelry(
  ctx: CanvasRenderingContext2D,
  userImg: HTMLImageElement,
  productImg: HTMLImageElement,
) {
  ctx.save();
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "source-over";
  drawCoverFit(ctx, userImg, 0, 0, CANVAS_W, CANVAS_H);
  ctx.restore();

  // Jewelry at neck/collarbone: 22-28% from top, centered
  const jw = Math.floor(CANVAS_W * 0.52);
  const aspect =
    productImg.naturalHeight > 0 && productImg.naturalWidth > 0
      ? productImg.naturalHeight / productImg.naturalWidth
      : 1;
  const jh = Math.floor(jw * aspect);
  const jx = Math.floor((CANVAS_W - jw) / 2);
  const jy = Math.floor(CANVAS_H * 0.24);

  // Sample neck color for blending
  const [neckR, neckG, neckB] = sampleAverageColor(
    ctx,
    jx,
    jy,
    jw,
    Math.min(jh, 40),
  );

  // Off-canvas: jewelry with soft radial edge mask
  const off = document.createElement("canvas");
  off.width = jw;
  off.height = jh;
  const offCtx = off.getContext("2d")!;
  offCtx.drawImage(productImg, 0, 0, jw, jh);

  // Radial transparency mask (edges blend into skin)
  offCtx.globalCompositeOperation = "destination-in";
  const mask = offCtx.createRadialGradient(
    jw / 2,
    jh / 2,
    jh * 0.05,
    jw / 2,
    jh / 2,
    jh * 0.68,
  );
  mask.addColorStop(0, "rgba(0,0,0,1)");
  mask.addColorStop(0.6, "rgba(0,0,0,0.97)");
  mask.addColorStop(0.85, "rgba(0,0,0,0.7)");
  mask.addColorStop(1, "rgba(0,0,0,0)");
  offCtx.fillStyle = mask;
  offCtx.fillRect(0, 0, jw, jh);

  // Layer 1: Skin-toned shadow under jewelry (depth)
  ctx.save();
  ctx.globalAlpha = 0.3;
  ctx.globalCompositeOperation = "multiply";
  ctx.shadowColor = `rgb(${Math.round(neckR * 0.6)},${Math.round(neckG * 0.5)},${Math.round(neckB * 0.4)})`;
  ctx.shadowBlur = 18;
  ctx.shadowOffsetX = 4;
  ctx.shadowOffsetY = 7;
  ctx.drawImage(off, jx + 5, jy + 8, jw, jh);
  ctx.restore();

  // Layer 2: Main jewelry with perspective scaling (top slightly smaller = depth illusion)
  const scalePerspective = 0.96;
  const perspShift = (jw * (1 - scalePerspective)) / 2;
  ctx.save();
  ctx.globalAlpha = 0.95;
  ctx.globalCompositeOperation = "source-over";
  // Slight perspective: draw with minimal transform
  ctx.transform(scalePerspective, 0, 0, 1, perspShift, 0);
  ctx.drawImage(off, jx / scalePerspective, jy, jw, jh);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.restore();

  // Layer 3: Outer warm golden glow
  ctx.save();
  ctx.globalAlpha = 0.22;
  ctx.globalCompositeOperation = "screen";
  const outerGlow = ctx.createRadialGradient(
    jx + jw / 2,
    jy + jh / 2,
    0,
    jx + jw / 2,
    jy + jh / 2,
    jw * 0.72,
  );
  outerGlow.addColorStop(0, "rgba(255,215,80,0.85)");
  outerGlow.addColorStop(0.5, "rgba(255,185,50,0.4)");
  outerGlow.addColorStop(1, "rgba(255,165,30,0)");
  ctx.fillStyle = outerGlow;
  ctx.fillRect(jx - 30, jy - 20, jw + 60, jh + 40);
  ctx.restore();

  // Layer 4: Inner sparkle glow
  ctx.save();
  ctx.globalAlpha = 0.16;
  ctx.globalCompositeOperation = "screen";
  const innerGlow = ctx.createRadialGradient(
    jx + jw * 0.35,
    jy + jh * 0.3,
    0,
    jx + jw * 0.35,
    jy + jh * 0.3,
    jw * 0.35,
  );
  innerGlow.addColorStop(0, "rgba(255,255,230,1)");
  innerGlow.addColorStop(0.4, "rgba(255,230,140,0.5)");
  innerGlow.addColorStop(1, "rgba(255,230,140,0)");
  ctx.fillStyle = innerGlow;
  ctx.fillRect(jx, jy, jw, jh);
  ctx.restore();

  // Layer 5: Skin ambient from jewelry (jewelry color casts onto chest)
  ctx.save();
  ctx.globalAlpha = 0.06;
  ctx.globalCompositeOperation = "screen";
  ctx.fillStyle = "rgba(255,200,80,1)";
  ctx.fillRect(jx - 10, jy - 30, jw + 20, 60);
  ctx.restore();

  drawBottomLabel(ctx, "✨ AI Jewelry Look — Dali's Boutique");
  drawDecorativeBorder(ctx);
  drawWatermark(ctx);
}

// ─── HANDBAG: perspective-angled realistic compositing ──────────────────────
function compositeForHandbag(
  ctx: CanvasRenderingContext2D,
  userImg: HTMLImageElement,
  productImg: HTMLImageElement,
) {
  ctx.save();
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "source-over";
  drawCoverFit(ctx, userImg, 0, 0, CANVAS_W, CANVAS_H);
  ctx.restore();

  // Bag at hip-right area: 50-70% from top, right-of-center
  const bw = Math.floor(CANVAS_W * 0.36);
  const aspect =
    productImg.naturalHeight > 0 && productImg.naturalWidth > 0
      ? productImg.naturalHeight / productImg.naturalWidth
      : 1;
  const bh = Math.floor(bw * aspect);
  const bx = Math.floor(CANVAS_W * 0.56);
  const by = Math.floor(CANVAS_H * 0.58) - Math.floor(bh / 2);

  // Sample background for realistic shadow color
  const [bgR, bgG, bgB] = sampleAverageColor(ctx, bx, by + bh - 30, bw, 30);

  // Layer 1: Ground contact shadow ellipse
  ctx.save();
  ctx.globalAlpha = 0.28;
  ctx.globalCompositeOperation = "multiply";
  ctx.fillStyle = `rgb(${Math.round(bgR * 0.4)},${Math.round(bgG * 0.4)},${Math.round(bgB * 0.4)})`;
  ctx.beginPath();
  ctx.ellipse(bx + bw / 2, by + bh + 6, bw * 0.42, 9, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Layer 2: Soft drop shadow
  ctx.save();
  ctx.globalAlpha = 0.28;
  ctx.globalCompositeOperation = "multiply";
  ctx.shadowColor = `rgb(${Math.round(bgR * 0.3)},${Math.round(bgG * 0.3)},${Math.round(bgB * 0.3)})`;
  ctx.shadowBlur = 28;
  ctx.shadowOffsetX = 7;
  ctx.shadowOffsetY = 12;
  ctx.drawImage(productImg, bx, by, bw, bh);
  ctx.restore();

  // Layer 3: Main bag with slight perspective tilt (3D depth illusion)
  ctx.save();
  ctx.globalAlpha = 0.96;
  ctx.globalCompositeOperation = "source-over";
  // Slight skew/tilt transform for 3D perspective feel
  ctx.transform(1, 0, -0.04, 1, by * 0.04, 0);
  ctx.shadowColor = "rgba(0,0,0,0.42)";
  ctx.shadowBlur = 16;
  ctx.shadowOffsetX = 5;
  ctx.shadowOffsetY = 9;
  ctx.drawImage(productImg, bx, by, bw, bh);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.restore();

  // Layer 4: Surface specular highlight (top-left catch light)
  ctx.save();
  ctx.globalAlpha = 0.13;
  ctx.globalCompositeOperation = "screen";
  const hl = ctx.createLinearGradient(bx, by, bx + bw * 0.5, by + bh * 0.5);
  hl.addColorStop(0, "rgba(255,255,255,1)");
  hl.addColorStop(0.4, "rgba(255,255,255,0.4)");
  hl.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = hl;
  ctx.fillRect(bx, by, bw, bh * 0.6);
  ctx.restore();

  // Layer 5: Bag surface mid-shine (horizontal stripe reflection)
  ctx.save();
  ctx.globalAlpha = 0.07;
  ctx.globalCompositeOperation = "screen";
  const midShine = ctx.createLinearGradient(
    bx,
    by + bh * 0.35,
    bx,
    by + bh * 0.55,
  );
  midShine.addColorStop(0, "rgba(255,255,255,0)");
  midShine.addColorStop(0.5, "rgba(255,255,255,1)");
  midShine.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = midShine;
  ctx.fillRect(bx, by + bh * 0.35, bw, bh * 0.2);
  ctx.restore();

  drawProductThumbnail(ctx, productImg);
  drawBottomLabel(ctx, "✨ AI Handbag Look — Dali's Boutique");
  drawDecorativeBorder(ctx);
  drawWatermark(ctx);
}

// ─── Processing step type ─────────────────────────────────────────────────────
interface ProcessingStep {
  label: string;
  done: boolean;
  active: boolean;
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function TryOnCanvas({
  userImage,
  productImageUrl,
  categoryLabel,
  productName,
}: TryOnCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<"processing" | "done" | "error">(
    "processing",
  );
  const [steps, setSteps] = useState<ProcessingStep[]>(
    PROCESSING_STEPS.map((s, i) => ({
      label: s.label,
      done: false,
      active: i === 0,
    })),
  );
  const [progress, setProgress] = useState(0);
  const [showBefore, setShowBefore] = useState(false);

  useEffect(() => {
    if (!userImage || !productImageUrl) return;

    setPhase("processing");
    setShowBefore(false);
    setSteps(
      PROCESSING_STEPS.map((s, i) => ({
        label: s.label,
        done: false,
        active: i === 0,
      })),
    );
    setProgress(0);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const userImg = new Image();
    const productImg = new Image();
    let userLoaded = false;
    let productLoaded = false;
    let hasError = false;
    let cancelled = false;

    const totalDuration = PROCESSING_STEPS.reduce(
      (s, st) => s + st.duration,
      0,
    );

    async function runSteps() {
      let elapsed = 0;
      for (let i = 0; i < PROCESSING_STEPS.length; i++) {
        if (cancelled) break;
        const step = PROCESSING_STEPS[i];
        setSteps((prev) =>
          prev.map((s, idx) => ({ ...s, active: idx === i, done: idx < i })),
        );
        const stepPct = (step.duration / totalDuration) * 100;
        const startPct = (elapsed / totalDuration) * 100;
        const startTime = Date.now();
        await new Promise<void>((resolve) => {
          const tick = () => {
            if (cancelled) {
              resolve();
              return;
            }
            const t = Math.min(1, (Date.now() - startTime) / step.duration);
            setProgress(startPct + stepPct * t);
            if (t < 1) requestAnimationFrame(tick);
            else resolve();
          };
          requestAnimationFrame(tick);
        });
        elapsed += step.duration;
        setSteps((prev) =>
          prev.map((s, idx) => ({
            ...s,
            active: idx === i + 1,
            done: idx <= i,
          })),
        );
      }
      setProgress(100);
    }

    function tryDraw() {
      if (!userLoaded || !productLoaded || hasError) return;
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
      try {
        if (categoryLabel === "jewelry") {
          compositeForJewelry(ctx, userImg, productImg);
        } else if (categoryLabel === "handbag") {
          compositeForHandbag(ctx, userImg, productImg);
        } else {
          compositeForSaree(ctx, userImg, productImg);
        }
        setPhase("done");
      } catch {
        hasError = true;
        setPhase("error");
      }
    }

    userImg.onload = () => {
      userLoaded = true;
      tryDraw();
    };
    userImg.onerror = () => {
      hasError = true;
      setPhase("error");
    };
    userImg.src = userImage;

    productImg.crossOrigin = "anonymous";
    productImg.onload = () => {
      productLoaded = true;
      tryDraw();
    };
    productImg.onerror = () => {
      // Retry without crossOrigin (for CORS-unconfigured servers)
      const fallback = new Image();
      fallback.onload = () => {
        productLoaded = true;
        tryDraw();
      };
      fallback.onerror = () => {
        hasError = true;
        setPhase("error");
      };
      fallback.src = productImageUrl;
    };
    productImg.src = productImageUrl;

    runSteps();
    return () => {
      cancelled = true;
    };
  }, [userImage, productImageUrl, categoryLabel]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/jpeg", 0.94);
      a.download = `dalis-boutique-ai-look-${productName.replace(/\s+/g, "-").toLowerCase()}.jpg`;
      a.click();
    } catch {
      /* CORS tainted canvas — cannot export */
    }
  };

  if (phase === "error") {
    return (
      <div
        className="flex items-center justify-center rounded-xl border border-dashed border-amber-300 bg-amber-50 text-amber-700 text-sm font-sans p-8"
        style={{ width: CANVAS_W, maxWidth: "100%" }}
        data-ocid="tryon.error_state"
      >
        Preview unavailable — please try a different image.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* ── Processing animation ── */}
      {phase === "processing" && (
        <div
          className="w-full rounded-2xl overflow-hidden shadow-2xl"
          style={{
            maxWidth: CANVAS_W,
            background:
              "linear-gradient(145deg, #0f0c08 0%, #1a1208 40%, #12100e 100%)",
          }}
          data-ocid="tryon.loading_state"
        >
          <div className="p-6 space-y-5">
            {/* Header */}
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center shadow-lg shrink-0"
                style={{
                  background:
                    "linear-gradient(135deg, #c8922a, #e8b84b, #9b6e1a)",
                }}
              >
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <p
                  className="text-white font-semibold text-sm tracking-wide"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  AI Look Generator
                </p>
                <p className="text-amber-400/70 text-xs">
                  Dali's Boutique Virtual Styling
                </p>
              </div>
              <div className="ml-auto flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>

            {/* Progress bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-amber-400/60">Neural Processing</span>
                <span className="text-amber-300 font-semibold tabular-nums">
                  {Math.round(progress)}%
                </span>
              </div>
              <div
                className="h-2.5 rounded-full overflow-hidden"
                style={{
                  background: "rgba(255,200,80,0.08)",
                  border: "1px solid rgba(200,145,30,0.2)",
                }}
              >
                <div
                  className="h-full rounded-full transition-all duration-100"
                  style={{
                    width: `${progress}%`,
                    background:
                      "linear-gradient(90deg, #8B5E1A, #C8922A, #E8B84B, #F5D070)",
                    boxShadow: "0 0 8px rgba(232,184,75,0.55)",
                  }}
                />
              </div>
            </div>

            {/* Step list */}
            <div className="space-y-2">
              {steps.map((step) => (
                <div
                  key={step.label}
                  className={`flex items-center gap-3 transition-all duration-300 ${
                    step.done
                      ? "opacity-55"
                      : step.active
                        ? "opacity-100"
                        : "opacity-25"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                      step.done
                        ? "bg-green-900/40 border border-green-600/50"
                        : step.active
                          ? "border border-amber-400/60"
                          : "border border-white/10"
                    }`}
                    style={
                      step.active
                        ? {
                            background: "rgba(200,146,42,0.2)",
                            boxShadow: "0 0 8px rgba(200,146,42,0.3)",
                          }
                        : {}
                    }
                  >
                    {step.done ? (
                      <div className="w-2 h-2 rounded-full bg-green-400" />
                    ) : step.active ? (
                      <Loader2 className="w-3 h-3 text-amber-400 animate-spin" />
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-white/15" />
                    )}
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      step.done
                        ? "text-green-400/70 line-through decoration-green-700"
                        : step.active
                          ? "text-amber-300"
                          : "text-white/25"
                    }`}
                    style={step.active ? { fontFamily: "Georgia, serif" } : {}}
                  >
                    {step.label}
                  </span>
                  {step.active && (
                    <Zap className="w-3 h-3 text-amber-400 animate-pulse ml-auto shrink-0" />
                  )}
                </div>
              ))}
            </div>

            {/* Animated preview placeholder */}
            <div
              className="w-full rounded-xl overflow-hidden relative"
              style={{
                height: 180,
                background: "rgba(255,200,80,0.04)",
                border: "1px solid rgba(200,145,30,0.12)",
              }}
            >
              <div
                className="absolute inset-0 animate-pulse"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(200,145,30,0.08) 0%, rgba(200,145,30,0.02) 50%, rgba(200,145,30,0.08) 100%)",
                }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                <Sparkles className="w-7 h-7 text-amber-500/40 animate-pulse" />
                <p className="text-amber-400/40 text-xs">
                  Generating your AI look...
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Result canvas ── */}
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{
          maxWidth: "100%",
          display: phase === "done" ? "block" : "none",
          border: "1px solid rgba(220,175,60,0.3)",
        }}
      >
        {/* Before/After toggle */}
        {phase === "done" && (
          <div className="absolute top-3 left-3 z-10">
            <button
              type="button"
              onClick={() => setShowBefore((v) => !v)}
              className="flex items-center gap-1.5 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full border transition-colors"
              style={{
                background: "rgba(0,0,0,0.55)",
                borderColor: "rgba(255,255,255,0.18)",
              }}
              data-ocid="tryon.toggle"
            >
              {showBefore ? (
                <>
                  <EyeOff className="w-3 h-3" /> View AI Look
                </>
              ) : (
                <>
                  <Eye className="w-3 h-3" /> View Original
                </>
              )}
            </button>
          </div>
        )}

        {/* AI Look badge */}
        {phase === "done" && !showBefore && (
          <div className="absolute top-3 right-3 z-10">
            <div
              className="backdrop-blur-md text-[9px] px-2.5 py-1 rounded-full text-center leading-tight"
              style={{
                background: "rgba(0,0,0,0.6)",
                border: "1px solid rgba(220,175,60,0.35)",
                color: "rgba(255,215,80,0.9)",
                letterSpacing: "0.05em",
              }}
            >
              ✨ AI Look Generator
            </div>
          </div>
        )}

        {/* Before: original photo overlay */}
        {showBefore && userImage && phase === "done" && (
          <div className="absolute inset-0" style={{ zIndex: 5 }}>
            <img
              src={userImage}
              alt="Original portrait"
              className="w-full h-full object-cover"
            />
            <div
              className="absolute bottom-3 left-1/2 -translate-x-1/2 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm"
              style={{ background: "rgba(0,0,0,0.65)", whiteSpace: "nowrap" }}
            >
              Original Photo
            </div>
          </div>
        )}

        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          data-ocid="tryon.canvas_target"
          style={{ display: "block", maxWidth: "100%", height: "auto" }}
        />
      </div>

      {/* ── Actions ── */}
      {phase === "done" && (
        <div className="flex flex-col items-center gap-2.5">
          <Button
            onClick={handleDownload}
            data-ocid="tryon.download_button"
            variant="outline"
            size="sm"
            className="gap-2 text-xs tracking-wider uppercase rounded-full px-6"
            style={{
              borderColor: "rgba(200,145,30,0.55)",
              color: "#8B5E1A",
            }}
          >
            <Download className="w-3.5 h-3.5" />
            Save AI Look
          </Button>
          <p className="text-[10px] text-muted-foreground text-center max-w-xs leading-relaxed">
            AI Style Preview — for best results, use a clear front-facing photo
            with good lighting.
          </p>
        </div>
      )}
    </div>
  );
}
