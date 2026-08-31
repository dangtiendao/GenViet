import React from "react";
import Link from "next/link";
import {
  GitFork,
  ArrowRight,
  ShieldCheck,
  HeartHandshake,
  Search,
  FileDown,
  Smartphone,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { listPublicTrees } from "@/features/public-trees/services/list-public-trees";
import { PublicTreesShowcase } from "@/features/public-trees/components/public-trees-showcase";

export default async function HomePage() {
  const publicTrees = await listPublicTrees(6);

  return (
    <div className="flex min-h-screen flex-col bg-white text-neutral-900">
      {/* Top Header / Navigation */}
      <header className="sticky top-0 z-40 border-b border-neutral-200/80 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo & Brand */}
          <Link
            href="/"
            className="flex items-center space-x-2.5 rounded-lg p-1 text-emerald-800 transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:outline-none"
            aria-label="GenViet - Trang chủ"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-700 text-white shadow-sm">
              <GitFork className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg leading-tight font-bold tracking-tight text-neutral-900">
                GenViet
              </span>
              <span className="text-[10px] font-medium text-emerald-700">Gia phả trực tuyến</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden items-center space-x-8 text-sm font-medium text-neutral-600 md:flex">
            {publicTrees.length > 0 && (
              <a href="#gia-pha-cong-khai" className="transition-colors hover:text-emerald-800">
                Gia phả công khai
              </a>
            )}
            <a href="#tinh-nang" className="transition-colors hover:text-emerald-800">
              Tính năng nổi bật
            </a>
            <a href="#quy-trinh" className="transition-colors hover:text-emerald-800">
              Cách bắt đầu
            </a>
            <a href="#y-nghia" className="transition-colors hover:text-emerald-800">
              Ý nghĩa dòng họ
            </a>
          </nav>

          {/* Authentication Actions */}
          <div className="flex items-center space-x-3">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-neutral-700 hover:text-neutral-900"
            >
              <Link href="/login">Đăng nhập</Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="bg-emerald-700 text-white shadow-xs hover:bg-emerald-800"
            >
              <Link href="/sign-up">Đăng ký</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/70 via-white to-white py-16 sm:py-24 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
              {/* Left Column: Hero Text & CTAs */}
              <div className="text-center lg:col-span-7 lg:text-left">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-800 shadow-2xs">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" aria-hidden="true" />
                  <span>Nền tảng Gia phả &amp; Phả hệ Chuẩn Mực Việt</span>
                </div>

                <div className="mt-4 space-y-3">
                  <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl">
                    GenViet
                  </h1>
                  <p className="text-xl font-bold tracking-normal text-emerald-800 sm:text-2xl lg:text-3xl">
                    Gìn giữ cội nguồn — Kết nối ngàn đời
                  </p>
                </div>

                <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-neutral-600 sm:text-lg lg:mx-0">
                  Lưu truyền lịch sử dòng họ, kết nối các thế hệ con cháu và trực quan hóa mối quan
                  hệ thân tộc theo chuẩn mực xưng hô văn hóa Việt với sự riêng tư và bảo mật tuyệt
                  đối.
                </p>

                {/* Hero CTA Buttons */}
                <div className="mt-8 flex flex-wrap justify-center gap-3.5 sm:gap-4 lg:justify-start">
                  <Button
                    asChild
                    size="lg"
                    className="min-h-[48px] bg-emerald-700 px-6 text-base font-semibold text-white shadow-md hover:bg-emerald-800"
                  >
                    <Link href="/sign-up">
                      Tạo cây gia phả miễn phí
                      <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="min-h-[48px] border-neutral-300 px-6 text-base font-medium text-neutral-700 hover:bg-neutral-50"
                  >
                    <Link href="/login">Đăng nhập tài khoản</Link>
                  </Button>
                </div>

                {/* Value Checklist */}
                <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-medium text-neutral-500 lg:justify-start">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                    <span>Bảo mật dữ liệu 100%</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                    <span>Chuẩn xưng hô họ hàng Việt</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                    <span>Hỗ trợ di động &amp; Offline</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Visual Interactive Mockup Card */}
              <div className="lg:col-span-5">
                <div className="relative mx-auto max-w-md rounded-2xl border border-neutral-200/90 bg-white p-6 shadow-xl shadow-emerald-950/5 sm:p-8">
                  {/* Mock Tree Header */}
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
                        <GitFork className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <div>
                        <h2 className="text-sm font-bold text-neutral-900">Gia Phả Họ Nguyễn</h2>
                        <p className="text-xs text-neutral-500">Chi Trưởng • Đời thứ 5</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                      Trực quan
                    </span>
                  </div>

                  {/* Mock Tree Hierarchy */}
                  <div className="mt-6 space-y-4">
                    {/* Ancestor Level */}
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3.5 text-center shadow-2xs">
                      <p className="text-[11px] font-medium text-emerald-800">
                        Đời I — Cụ Tổ Khởi Nghiệp
                      </p>
                      <p className="text-sm font-bold text-neutral-900">
                        Nguyễn Văn Khởi (1890 - 1968)
                      </p>
                      <p className="text-[10px] text-neutral-500">Chánh quán: Nam Định</p>
                    </div>

                    {/* Tree Connector */}
                    <div className="mx-auto h-4 w-0.5 bg-emerald-300" />

                    {/* Second Generation */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg border border-neutral-200 bg-white p-3 text-center shadow-2xs">
                        <p className="text-[10px] font-semibold text-emerald-700">
                          Đời II (Trưởng)
                        </p>
                        <p className="text-xs font-bold text-neutral-900">Nguyễn Văn Phúc</p>
                        <p className="text-[10px] text-neutral-500">Trưởng Chi</p>
                      </div>
                      <div className="rounded-lg border border-neutral-200 bg-white p-3 text-center shadow-2xs">
                        <p className="text-[10px] font-semibold text-emerald-700">Đời II (Thứ)</p>
                        <p className="text-xs font-bold text-neutral-900">Nguyễn Văn Đức</p>
                        <p className="text-[10px] text-neutral-500">Thứ Chi</p>
                      </div>
                    </div>

                    {/* Tree Connector */}
                    <div className="mx-auto h-4 w-0.5 bg-emerald-300" />

                    {/* Third Generation / Current */}
                    <div className="rounded-xl border border-dashed border-emerald-300 bg-emerald-50/40 p-3 text-center">
                      <p className="text-[10px] font-semibold text-emerald-700">
                        Đời III — Thế hệ tiếp nối
                      </p>
                      <p className="text-xs font-medium text-neutral-700">
                        Nguyễn Văn An, Nguyễn Thị Mai, Nguyễn Văn Bình...
                      </p>
                    </div>
                  </div>

                  {/* Quick Highlight Footer */}
                  <div className="mt-6 rounded-lg bg-neutral-50 p-3 text-center text-xs text-neutral-600">
                    <span className="font-semibold text-emerald-800">Tự động xưng hô:</span> Xác
                    định chính xác quan hệ ông bà, cô dì chú bác, anh chị em họ.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Public Trees Showcase Section */}
        <PublicTreesShowcase trees={publicTrees} />

        {/* Core Features Grid */}
        <section
          id="tinh-nang"
          className="border-t border-neutral-200/80 bg-neutral-50/50 py-16 sm:py-24"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-xs font-bold tracking-widest text-emerald-700 uppercase">
                Tính năng tiêu biểu
              </h2>
              <p className="mt-2 text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl lg:text-4xl">
                Được thiết kế riêng cho Gia tộc &amp; Dòng họ Việt
              </p>
              <p className="mx-auto mt-3 max-w-2xl text-sm text-neutral-600 sm:text-base">
                Mọi công cụ bạn cần để xây dựng, tra cứu và bảo tồn di sản phả hệ qua nhiều thế hệ.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-2xs transition-shadow hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
                  <GitFork className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-base font-bold text-neutral-900">Cây Gia Phả Trực Quan</h3>
                <p className="mt-2 text-xs leading-relaxed text-neutral-600 sm:text-sm">
                  Sơ đồ phả đồ thông minh, hỗ trợ thu phóng mượt mà, phân nhánh nhiều đời rõ ràng và
                  không giới hạn quy mô gia tộc.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-2xs transition-shadow hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
                  <HeartHandshake className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-base font-bold text-neutral-900">
                  Chuẩn Mực Xưng Hô Việt
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-neutral-600 sm:text-sm">
                  Tự động phân tích và xác định danh xưng họ hàng chính xác theo vai vế, thứ bậc và
                  cội nguồn gia tộc truyền thống.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-2xs transition-shadow hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 text-teal-800">
                  <ShieldCheck className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-base font-bold text-neutral-900">
                  Bảo Mật Quyền Riêng Tư
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-neutral-600 sm:text-sm">
                  Dữ liệu gia phả thuộc toàn quyền sở hữu của bạn. Phân quyền xem, chỉnh sửa và đóng
                  góp cho các thành viên chặt chẽ.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-2xs transition-shadow hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-800">
                  <Search className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-base font-bold text-neutral-900">
                  Tra Cứu &amp; Tìm Kiếm Nhanh
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-neutral-600 sm:text-sm">
                  Tìm kiếm thông tin thành viên theo tên, thế hệ, cành nhánh, quê quán hoặc ngày giỗ
                  âm lịch chỉ trong tích tắc.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-2xs transition-shadow hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-100 text-rose-800">
                  <FileDown className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-base font-bold text-neutral-900">
                  Xuất Phả Đồ &amp; In Ấn PDF
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-neutral-600 sm:text-sm">
                  Xuất cây gia phả ra tài liệu PDF khổ lớn sắc nét phục vụ in ấn treo nhà thờ họ, hỗ
                  trợ chuẩn quốc tế GEDCOM.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-2xs transition-shadow hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-800">
                  <Smartphone className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-base font-bold text-neutral-900">
                  Đa Nền Tảng PWA &amp; Offline
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-neutral-600 sm:text-sm">
                  Cài đặt như một ứng dụng trên điện thoại và máy tính, truy cập và tra cứu thông
                  tin gia phả mọi lúc, mọi nơi.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3 Steps Quick Start */}
        <section id="quy-trinh" className="bg-white py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-xs font-bold tracking-widest text-emerald-700 uppercase">
                Bắt đầu dễ dàng
              </h2>
              <p className="mt-2 text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
                Chỉ 3 bước để khởi tạo Gia Phả Gia Đình
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
              {/* Step 1 */}
              <div className="relative rounded-2xl border border-neutral-200 bg-neutral-50/50 p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-700 text-lg font-bold text-white shadow-sm">
                  1
                </div>
                <h3 className="mt-4 text-base font-bold text-neutral-900">
                  Tạo tài khoản &amp; Cây mới
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-neutral-600 sm:text-sm">
                  Đăng ký tài khoản cá nhân miễn phí và đặt tên cho cây gia phả của gia đình hoặc
                  dòng tộc.
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative rounded-2xl border border-neutral-200 bg-neutral-50/50 p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-700 text-lg font-bold text-white shadow-sm">
                  2
                </div>
                <h3 className="mt-4 text-base font-bold text-neutral-900">
                  Thêm thành viên &amp; Sự kiện
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-neutral-600 sm:text-sm">
                  Nhập thông tin tiền bối, con cháu, quan hệ hôn nhân, ngày sinh, ngày giỗ âm lịch
                  và ảnh lưu niệm.
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative rounded-2xl border border-neutral-200 bg-neutral-50/50 p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-700 text-lg font-bold text-white shadow-sm">
                  3
                </div>
                <h3 className="mt-4 text-base font-bold text-neutral-900">
                  Gắn kết &amp; Lưu truyền
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-neutral-600 sm:text-sm">
                  Mời người thân cùng theo dõi, xuất bản phả đồ in ấn và lưu truyền lịch sử cho thế
                  hệ tương lai.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Cultural Quote / Value Banner */}
        <section id="y-nghia" className="bg-emerald-900 py-16 text-white">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-800 text-amber-300">
              <Sparkles className="h-6 w-6" aria-hidden="true" />
            </div>
            <blockquote className="text-lg leading-relaxed font-medium tracking-normal text-emerald-100 sm:text-2xl sm:leading-relaxed">
              &ldquo;Cây có cội mới trổ cành xanh lá, nước có nguồn mới bủa khắp rạch sông. Con
              người ta có tổ có tông, như cây có cội như sông có nguồn.&rdquo;
            </blockquote>
            <p className="mt-4 text-xs font-semibold tracking-wider text-emerald-300 uppercase">
              Ca dao tục ngữ Việt Nam — Lòng hiếu đạo &amp; Tri ân cội nguồn
            </p>
          </div>
        </section>

        {/* Bottom Call to Action */}
        <section className="bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
            <div className="rounded-3xl border border-emerald-100 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 p-8 sm:p-12">
              <h2 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
                Bắt đầu lưu giữ lịch sử dòng họ của bạn ngay hôm nay
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-xs leading-relaxed text-neutral-600 sm:text-sm">
                Tham gia cùng GenViet để xây dựng cây gia phả số chuẩn mực, bảo tồn ký ức và kết nối
                tình thân gia tộc.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button
                  asChild
                  size="lg"
                  className="min-h-[48px] bg-emerald-700 px-8 text-white shadow-sm hover:bg-emerald-800"
                >
                  <Link href="/sign-up">
                    Khởi tạo phả hệ ngay
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="min-h-[48px] bg-white text-neutral-800 hover:bg-neutral-100"
                >
                  <Link href="/login">Đăng nhập</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-neutral-50 py-10 text-neutral-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center space-x-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-700 text-white shadow-2xs">
                <GitFork className="h-4 w-4" aria-hidden="true" />
              </div>
              <span className="text-sm font-bold text-neutral-900">GenViet</span>
              <span className="text-xs text-neutral-400">•</span>
              <span className="text-xs text-neutral-500">
                Nền tảng Quản lý Cây Gia phả Việt Nam
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-500">
              <Link href="/login" className="hover:text-neutral-900">
                Đăng nhập
              </Link>
              <Link href="/sign-up" className="hover:text-neutral-900">
                Đăng ký
              </Link>
              <a href="#tinh-nang" className="hover:text-neutral-900">
                Tính năng
              </a>
              <a href="#y-nghia" className="hover:text-neutral-900">
                Ý nghĩa văn hóa
              </a>
            </div>
          </div>

          <div className="mt-8 border-t border-neutral-200/80 pt-6 text-center text-xs text-neutral-400">
            &copy; {new Date().getFullYear()} GenViet. Bảo lưu mọi quyền. Tôn vinh cội nguồn &amp;
            gia phong Việt.
          </div>
        </div>
      </footer>
    </div>
  );
}
