#!/usr/bin/env node

/**
 * Script xác minh cấu hình Custom Domain & Cloudflare DNS-Only (P24-T08, P24-T09)
 */

import dns from "dns";
import { promisify } from "util";

const resolveCname = promisify(dns.resolveCname);
const resolve4 = promisify(dns.resolve4);

async function verifyDomain(targetDomain = process.env.CUSTOM_DOMAIN || "genviet.vn") {
  console.log(`=== XÁC MINH CẤU HÌNH DOMAIN & DNS CHO ${targetDomain} ===`);

  try {
    const addresses = await resolve4(targetDomain).catch(() => []);
    console.log(
      `Bản ghi A tìm thấy cho ${targetDomain}:`,
      addresses.length > 0 ? addresses.join(", ") : "Chưa trỏ"
    );

    const wwwDomain = `www.${targetDomain}`;
    const cnames = await resolveCname(wwwDomain).catch(() => []);
    console.log(
      `Bản ghi CNAME cho ${wwwDomain}:`,
      cnames.length > 0 ? cnames.join(", ") : "Chưa trỏ"
    );

    console.log(
      "[LƯU Ý]: Đảm bảo trạng thái Proxy trên Cloudflare là 'DNS Only' (Đám mây xám) để Vercel tự động cấp phát chứng chỉ SSL."
    );
  } catch (err) {
    console.warn(
      "[CẢNH BÁO] Không thể giải giải mã DNS từ máy cục bộ hoặc domain chưa kích hoạt:",
      err.message
    );
  }
}

const domainArg = process.argv[2];
verifyDomain(domainArg);
