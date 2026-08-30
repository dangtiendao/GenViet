import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

/**
 * Pure Node.js PNG file generator with CRC32 and zlib compression
 */
function createPng(width, height, drawPixel) {
  // CRC32 table
  const crcTable = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    crcTable[i] = c;
  }

  function crc32(buf) {
    let crc = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
    }
    return (crc ^ 0xffffffff) >>> 0;
  }

  function writeChunk(type, data) {
    const len = data.length;
    const buf = Buffer.alloc(4 + 4 + len + 4);
    buf.writeUInt32BE(len, 0);
    buf.write(type, 4, 4, "ascii");
    data.copy(buf, 8);
    const crcBuf = Buffer.alloc(4 + len);
    buf.copy(crcBuf, 0, 4, 8 + len);
    const chunkCrc = crc32(crcBuf);
    buf.writeUInt32BE(chunkCrc, 8 + len);
    return buf;
  }

  // PNG Signature
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR Chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8); // Bit depth: 8
  ihdr.writeUInt8(6, 9); // Color type: 6 (RGBA)
  ihdr.writeUInt8(0, 10); // Compression: deflate
  ihdr.writeUInt8(0, 11); // Filter: standard
  ihdr.writeUInt8(0, 12); // Interlace: none
  const ihdrChunk = writeChunk("IHDR", ihdr);

  // Raw Image Data (Filter byte 0 + RGBA per line)
  const lineLength = 1 + width * 4;
  const rawData = Buffer.alloc(height * lineLength);

  for (let y = 0; y < height; y++) {
    const lineOffset = y * lineLength;
    rawData[lineOffset] = 0; // Filter: None
    for (let x = 0; x < width; x++) {
      const pixelOffset = lineOffset + 1 + x * 4;
      const [r, g, b, a] = drawPixel(x, y, width, height);
      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  // Deflate compressed data
  const compressed = zlib.deflateSync(rawData);
  const idatChunk = writeChunk("IDAT", compressed);

  // IEND Chunk
  const iendChunk = writeChunk("IEND", Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Brand Colors: Emerald #065F46 (6, 95, 70), Amber #D97706, White #FFFFFF
function drawStandardIcon(x, y, width, height) {
  const cx = width / 2;
  const cy = height / 2;
  const radius = width * 0.46;
  const dx = x - cx;
  const dy = y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // Background circle / rounded squircle
  if (dist <= radius) {
    // Tree trunk & branches stylized geometry
    const nx = dx / (width * 0.4);
    const ny = dy / (height * 0.4);

    // Central trunk
    if (Math.abs(nx) < 0.12 && ny > -0.2 && ny < 0.6) {
      return [255, 255, 255, 255]; // White trunk
    }
    // Crown circles
    const crownDist1 = Math.sqrt(nx * nx + (ny + 0.3) * (ny + 0.3));
    const crownDist2 = Math.sqrt((nx - 0.35) * (nx - 0.35) + ny * ny);
    const crownDist3 = Math.sqrt((nx + 0.35) * (nx + 0.35) + ny * ny);

    if (crownDist1 < 0.42 || crownDist2 < 0.35 || crownDist3 < 0.35) {
      return [255, 255, 255, 255]; // White tree crown
    }

    return [6, 95, 70, 255]; // Emerald-800 background
  }

  return [0, 0, 0, 0]; // Transparent outside
}

function drawMaskableIcon(x, y, width, height) {
  // Full bleed emerald background with inner safe-zone graphic
  const cx = width / 2;
  const cy = height / 2;
  const dx = x - cx;
  const dy = y - cy;
  const nx = dx / (width * 0.3);
  const ny = dy / (height * 0.3);

  // Trunk
  if (Math.abs(nx) < 0.12 && ny > -0.2 && ny < 0.6) {
    return [255, 255, 255, 255];
  }
  // Crown
  const crownDist1 = Math.sqrt(nx * nx + (ny + 0.3) * (ny + 0.3));
  const crownDist2 = Math.sqrt((nx - 0.35) * (nx - 0.35) + ny * ny);
  const crownDist3 = Math.sqrt((nx + 0.35) * (nx + 0.35) + ny * ny);

  if (crownDist1 < 0.42 || crownDist2 < 0.35 || crownDist3 < 0.35) {
    return [255, 255, 255, 255];
  }

  return [6, 95, 70, 255]; // Solid emerald-800
}

const publicDir = path.resolve(process.cwd(), "public");
const iconsDir = path.resolve(publicDir, "icons");

fs.mkdirSync(iconsDir, { recursive: true });

console.log("Generating PWA icons...");

// 192x192 standard icon
fs.writeFileSync(path.join(iconsDir, "icon-192x192.png"), createPng(192, 192, drawStandardIcon));
// 512x512 standard icon
fs.writeFileSync(path.join(iconsDir, "icon-512x512.png"), createPng(512, 512, drawStandardIcon));
// 192x192 maskable icon
fs.writeFileSync(
  path.join(iconsDir, "icon-maskable-192x192.png"),
  createPng(192, 192, drawMaskableIcon)
);
// 512x512 maskable icon
fs.writeFileSync(
  path.join(iconsDir, "icon-maskable-512x512.png"),
  createPng(512, 512, drawMaskableIcon)
);
// Apple touch icon 180x180 (solid background)
fs.writeFileSync(
  path.join(publicDir, "apple-touch-icon.png"),
  createPng(180, 180, drawMaskableIcon)
);
// Favicon 48x48
fs.writeFileSync(path.join(publicDir, "favicon.ico"), createPng(48, 48, drawStandardIcon));

console.log("PWA icons generated successfully!");
