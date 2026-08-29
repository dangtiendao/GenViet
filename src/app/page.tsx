import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="mx-auto max-w-md space-y-6 rounded-xl border border-neutral-200 bg-white p-8 shadow-sm">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-2xl font-bold text-neutral-800">
          🌳
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">GenViet</h1>
          <p className="text-sm text-neutral-600">
            Nền tảng Quản lý Cây Gia phả Cá nhân &amp; Dòng họ
          </p>
        </div>
        <div className="rounded-lg bg-neutral-50 p-4 text-xs text-neutral-600">
          <span className="font-semibold text-neutral-900">Trạng thái Kỹ thuật (P05):</span> Khởi
          tạo mã nguồn nền tảng thành công (App Router, Tailwind CSS, TypeScript strict, Testing
          Foundation).
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild size="sm">
            <a href="/login">Đăng nhập</a>
          </Button>
          <Button asChild variant="outline" size="sm">
            <a href="/sign-up">Đăng ký</a>
          </Button>
          <a
            href="/api/health"
            className="inline-flex items-center justify-center rounded-md border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
          >
            Health Check
          </a>
        </div>
      </div>
    </main>
  );
}
