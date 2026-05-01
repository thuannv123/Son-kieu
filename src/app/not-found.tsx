import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-5 px-4 text-center">
      <p className="text-7xl">🌿</p>
      <h1 className="text-3xl font-bold text-gray-900">Trang Không Tồn Tại</h1>
      <p className="text-gray-500">Đường dẫn bạn tìm kiếm không tồn tại hoặc đã bị di chuyển.</p>
      <Link
        href="/"
        className="mt-2 rounded-2xl bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700"
      >
        Về Trang Chủ
      </Link>
    </main>
  );
}
