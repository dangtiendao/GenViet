import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import { AUTH_ROUTES } from "@/lib/auth/constants";

export default function VerifyEmailPage() {
  return (
    <div className="space-y-6 text-center">
      <div className="bg-primary/10 text-primary mx-auto flex h-12 w-12 items-center justify-center rounded-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
          />
        </svg>
      </div>

      <div className="space-y-2">
        <h1 className="text-foreground text-xl font-semibold tracking-tight">
          Kiểm tra hộp thư đến của bạn
        </h1>
        <p className="text-muted-foreground text-xs leading-relaxed">
          Chúng tôi đã gửi một liên kết xác thực đến địa chỉ email của bạn. Vui lòng bấm vào liên
          kết trong email để kích hoạt tài khoản GenViet.
        </p>
      </div>

      <div className="bg-muted/30 text-muted-foreground space-y-1 rounded-lg border p-3 text-left text-xs">
        <p className="text-foreground font-medium">Không thấy email?</p>
        <p>Kiểm tra thư mục Thư rác (Spam/Junk) hoặc chờ trong ít phút.</p>
      </div>

      <Button asChild className="h-10 w-full font-medium">
        <Link href={AUTH_ROUTES.LOGIN}>Quay lại trang Đăng nhập</Link>
      </Button>
    </div>
  );
}
