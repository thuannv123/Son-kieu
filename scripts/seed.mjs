import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://ortoyhoexbattwdogatq.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ydG95aG9leGJhdHR3ZG9nYXRxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzE2MzY4MCwiZXhwIjoyMDkyNzM5NjgwfQ.qZ6a8RniUHocNjT4xbtkWl9ZU80GYW8D9P1BDmAcnO8",
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const activities = [
  {
    id: "a0000000-0000-0000-0000-000000000001",
    name: "Hang Phong Nhi",
    category: "CAVE",
    description: "Hang dong nguyen sinh dai hon 3km voi nhung thach nhu trieu nam tuoi. Anh den chieu vao tao ra nhung hinh thu ky ao nhu buc tranh thien nhien dieu khac tu thoi tien su.",
    safety_guideline: "- Doi mu bao hiem bat buoc trong toan bo hanh trinh.\n- Khong tu y roi khoi doan, luon bam theo huong dan vien.\n- Cam su dung den flash chup anh gan thach nhu.\n- Tre em duoi 6 tuoi khong duoc tham gia.",
    difficulty_level: "Trung binh",
    price: 250000,
    max_capacity: 80,
    max_per_slot: 10,
  },
  {
    id: "a0000000-0000-0000-0000-000000000002",
    name: "Hang Co Tich",
    category: "CAVE",
    description: "Hang dong co chieu cao vom len toi 40m, anh sang tu nhien xuyen qua khe da tao ra hieu ung cung dien anh sang vo cung huyen bi. Thich hop cho gia dinh va tre em.",
    safety_guideline: "- Mang giay de bang, chong truot.\n- Can than cac doan duong am uot.\n- Khong tha vat pham xuong long hang.",
    difficulty_level: "De",
    price: 180000,
    max_capacity: 100,
    max_per_slot: 12,
  },
  {
    id: "a0000000-0000-0000-0000-000000000003",
    name: "Hang Toi Bi An",
    category: "CAVE",
    description: "Trai nghiem tham hiem hang dong theo phong cach chuyen nghiep voi thiet bi den dau, bo qua cac khe da hep. Chi danh cho nguoi truong thanh khoe manh.",
    safety_guideline: "- Bat buoc kham suc khoe co ban truoc khi tham gia.\n- Chi nhan nguoi tu 18 tuoi tro len.\n- Khong phu hop voi nguoi bi claustrophobia.",
    difficulty_level: "Kho",
    price: 350000,
    max_capacity: 40,
    max_per_slot: 8,
  },
  {
    id: "a0000000-0000-0000-0000-000000000004",
    name: "Ho Boi Thien Nhien Ngoc Bich",
    category: "LAKE",
    description: "Ho nuoc tu nhien mau xanh ngoc bich hinh thanh tu mach nuoc ngam nui da voi, nhiet do duy tri 22-24 do C quanh nam.",
    safety_guideline: "- Bat buoc mac ao phao neu khong biet boi.\n- Khong nhay tu da vao ho.\n- Tam dung hoat dong khi co mua lon hoac sam set.",
    difficulty_level: null,
    price: 150000,
    max_capacity: 60,
    max_per_slot: 15,
  },
  {
    id: "a0000000-0000-0000-0000-000000000005",
    name: "Suoi Mat Rung Gia",
    category: "LAKE",
    description: "Suoi nuoc chay tu nhien bang qua rung gia nguyen sinh, voi nhieu doan thac nho va vung boi lo thien.",
    safety_guideline: "- Mang giay chong truot cho doan di bo trong rung.\n- Khong boi khi muc nuoc suoi dang cao sau mua.",
    difficulty_level: null,
    price: 120000,
    max_capacity: 40,
    max_per_slot: 10,
  },
  {
    id: "a0000000-0000-0000-0000-000000000006",
    name: "Dinh Vong Canh May Ngan",
    category: "SIGHTSEEING",
    description: "Diem ngam canh o do cao 650m voi tam nhin bao quat toan bo thung lung va day nui da voi hung vi.",
    safety_guideline: "- Bam chac tay vin tai cac diem ngam canh tren cao.\n- Khong vuot rao chan an toan.",
    difficulty_level: null,
    price: 80000,
    max_capacity: 120,
    max_per_slot: 20,
  },
  {
    id: "a0000000-0000-0000-0000-000000000007",
    name: "Rung Nguyen Sinh Xanh Tham",
    category: "SIGHTSEEING",
    description: "Hanh trinh kham pha rung nguyen sinh voi huong dan vien sinh thai, tim hieu ve he thuc vat nhiet doi.",
    safety_guideline: "- Mac quan ao dai va giay bit mui de bao ve khoi con trung.\n- Boi kem chong muoi truoc khi xuat phat.",
    difficulty_level: null,
    price: 140000,
    max_capacity: 50,
    max_per_slot: 10,
  },
];

const { data, error } = await supabase
  .from("activities")
  .upsert(activities, { onConflict: "id" })
  .select("id, name, category");

if (error) {
  console.error("❌ Seed failed:", error.message);
  process.exit(1);
}

console.log(`✅ Seeded ${data.length} activities:`);
data.forEach((a) => console.log(`   • [${a.category}] ${a.name}`));
