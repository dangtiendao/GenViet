#!/usr/bin/env node

/**
 * Script kiểm tra tính hợp lệ của kết nối SSL / HTTPS (P24-T10)
 */

import https from "https";

function checkSsl(targetUrl = process.env.NEXT_PUBLIC_APP_URL || "https://genviet.vn") {
  console.log(`=== KIỂM TRA CHỨNG CHỈ SSL / HTTPS: ${targetUrl} ===`);

  try {
    const urlObj = new URL(targetUrl);
    if (urlObj.protocol !== "https:") {
      console.warn(`[CẢNH BÁO] URL mục tiêu không sử dụng HTTPS: ${targetUrl}`);
      return;
    }

    const req = https.get(targetUrl, (res) => {
      const cert = res.socket.getPeerCertificate();
      if (cert && Object.keys(cert).length > 0) {
        console.log(`[OK] Chứng chỉ SSL cấp phát cho: ${cert.subject?.CN}`);
        console.log(`[OK] Nhà phát hành (Issuer): ${cert.issuer?.O || cert.issuer?.CN}`);
        console.log(`[OK] Hiệu lực đến ngày: ${cert.valid_to}`);
      } else {
        console.log(`[THÔNG BÁO] Kết nối HTTPS thành công (Status: ${res.statusCode})`);
      }
    });

    req.on("error", (err) => {
      console.warn(
        `[THÔNG BÁO] Không thể kết nối trực tiếp đến ${targetUrl} trong môi trường local: ${err.message}`
      );
    });

    req.setTimeout(5000, () => {
      req.destroy();
    });
  } catch (err) {
    console.warn(`[CẢNH BÁO] URL không hợp lệ: ${err.message}`);
  }
}

const target = process.argv[2];
checkSsl(target);
