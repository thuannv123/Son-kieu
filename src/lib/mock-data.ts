import type { Activity, TimeSlot } from "@/types";

const U = (id: string) => `https://images.unsplash.com/photo-${id}?w=800&auto=format&fit=crop&q=80`;

export const ACTIVITIES: Activity[] = [
  // ─── Combo chính ─────────────────────────────────────────────────────────
  {
    id: "activity-1",
    slug: "combo-tham-quan-tam-suoi",
    image_url: U("1439066615861-d1af74d74000"),
    name: "Combo Tham Quan, Check-in, Tắm Suối",
    category: "LAKE",
    description:
      "Gói dịch vụ chính tại Khu Du Lịch Sinh Thái Sơn Kiều — tham quan toàn khu, check-in các điểm sống ảo đẹp nhất và tắm suối thiên nhiên mát lành giữa rừng núi Trường Sơn.\n\nTrẻ em từ 1m đến 1m4: 50.000đ/vé. Trẻ em dưới 1m: MIỄN PHÍ.\n\nLưu ý: Giá vé không bao gồm dịch vụ chèo thuyền kayak và ăn uống.",
    safetyGuideline:
      "• Mặc áo phao bắt buộc khi tắm suối nếu không biết bơi.\n• Không nhảy từ đá cao xuống suối.\n• Giám sát chặt trẻ em mọi lúc.\n• Không uống rượu bia trước khi xuống suối.\n• Tạm dừng hoạt động khi có mưa lớn hoặc sấm sét.",
    price: 75000,
    maxCapacity: 200,
    maxPerSlot: 30,
    coverGradient: "from-teal-700 via-cyan-600 to-sky-700",
    rating: 4.8,
    reviewCount: 0,
    highlights: ["Tắm suối thiên nhiên", "Check-in cảnh đẹp", "Tham quan toàn khu"],
    durationMinutes: 240,
  },

  // ─── Hang động ───────────────────────────────────────────────────────────
  {
    id: "activity-2",
    slug: "tham-quan-3-hang-dong",
    image_url: U("1544735716-392fe2489ffa"),
    name: "Tham Quan 3 Hang Động",
    category: "CAVE",
    description:
      "Khám phá 3 hang động hùng vĩ tại Sơn Kiều — cảnh quan thiên nhiên triệu năm tuổi với thạch nhũ độc đáo, ánh sáng huyền ảo và không gian hang động rộng lớn nguyên sơ.\n\nĐây là dịch vụ đặc biệt, cần đặt vé trước để đảm bảo suất tham quan.",
    safetyGuideline:
      "• Mang giày đế bằng, chống trượt.\n• Không tự ý rời khỏi đoàn.\n• Cấm sử dụng đèn flash gần thạch nhũ.\n• Không chạm tay vào nhũ đá.\n• Giữ trật tự, không tạo tiếng ồn lớn trong hang.",
    difficultyLevel: "Trung bình",
    virtualTourUrl: "",
    price: 100000,
    maxCapacity: 80,
    maxPerSlot: 15,
    coverGradient: "from-slate-800 via-slate-700 to-stone-800",
    rating: 4.9,
    reviewCount: 0,
    highlights: ["3 hang động liên tiếp", "Thạch nhũ nguyên sơ", "Hướng dẫn viên đồng hành"],
    durationMinutes: 120,
  },

  // ─── Xe điện ─────────────────────────────────────────────────────────────
  {
    id: "activity-3",
    slug: "xe-dien-tham-quan",
    image_url: U("1506905925346-21bda4d32df4"),
    name: "Xe Điện Tham Quan Khu Du Lịch",
    category: "SIGHTSEEING",
    description:
      "Dịch vụ xe điện đưa đón khách tham quan toàn bộ khu du lịch Sơn Kiều một cách thoải mái và tiện lợi. Thích hợp cho người lớn tuổi, trẻ nhỏ và những ai muốn khám phá khu du lịch rộng lớn mà không mất sức.",
    safetyGuideline:
      "• Ngồi đúng chỗ quy định, thắt dây an toàn.\n• Không thò tay chân ra ngoài xe khi di chuyển.\n• Trẻ em phải ngồi cùng người lớn.\n• Tuân thủ hướng dẫn của tài xế.",
    price: 20000,
    maxCapacity: 200,
    maxPerSlot: 20,
    coverGradient: "from-amber-700 via-orange-600 to-yellow-700",
    rating: 4.7,
    reviewCount: 0,
    highlights: ["Tiện lợi, nhanh chóng", "Phù hợp mọi lứa tuổi", "Tham quan toàn khu"],
    durationMinutes: 30,
  },
];

export function getActivityById(id: string): Activity | undefined {
  return ACTIVITIES.find((a) => a.id === id);
}

export function getActivitiesByCategory(category: string): Activity[] {
  if (category === "ALL") return ACTIVITIES;
  return ACTIVITIES.filter((a) => a.category === category);
}

export function getMockSlots(_activityId: string, _date: string): TimeSlot[] {
  return [
    { id: "s1", time: "08:00", available: 8,  total: 10 },
    { id: "s2", time: "09:00", available: 3,  total: 10 },
    { id: "s3", time: "10:00", available: 10, total: 10 },
    { id: "s4", time: "11:00", available: 10, total: 10 },
    { id: "s5", time: "13:00", available: 6,  total: 10 },
    { id: "s6", time: "14:00", available: 9,  total: 10 },
    { id: "s7", time: "15:00", available: 2,  total: 10 },
    { id: "s8", time: "16:00", available: 7,  total: 10 },
  ];
}

export const CATEGORY_META: Record<string, { label: string; icon: string; color: string }> = {
  CAVE:        { label: "Hang Động",  icon: "🦇", color: "bg-slate-700 text-white"   },
  LAKE:        { label: "Hồ Bơi",    icon: "🏊", color: "bg-cyan-600 text-white"    },
  SIGHTSEEING: { label: "Tham Quan", icon: "🌄", color: "bg-amber-600 text-white"   },
  DINING:      { label: "Ẩm Thực",   icon: "🍽️", color: "bg-orange-500 text-white"  },
};

export const DIFFICULTY_META: Record<string, { color: string }> = {
  "Dễ":         { color: "bg-green-100 text-green-700"  },
  "Trung bình": { color: "bg-yellow-100 text-yellow-700" },
  "Khó":        { color: "bg-red-100 text-red-700"       },
};
