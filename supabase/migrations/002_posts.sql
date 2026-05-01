-- Run this in Supabase SQL Editor
-- Table: posts (blog articles)

create table if not exists posts (
  id            uuid        default gen_random_uuid() primary key,
  title         text        not null,
  slug          text        unique not null,
  excerpt       text,
  content       text,
  category      text        not null default 'news',
  author        text        not null default 'AMF-ECO Team',
  is_published  boolean     not null default false,
  published_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Auto-update updated_at
create trigger set_posts_updated_at
  before update on posts
  for each row execute procedure moddatetime(updated_at);

-- RLS
alter table posts enable row level security;

create policy "Public can read published posts"
  on posts for select
  using (is_published = true);

create policy "Service role full access on posts"
  on posts for all
  using (auth.role() = 'service_role');

-- Seed a few sample posts
insert into posts (title, slug, excerpt, content, category, author, is_published, published_at) values
(
  'Kinh nghiệm khám phá Hang Phong Nha lần đầu',
  'kham-pha-hang-phong-nha-lan-dau',
  'Những điều bạn cần biết trước khi đặt tour hang động — từ trang phục, thiết bị đến những điều tuyệt đối không được bỏ lỡ.',
  'Hang Phong Nha là một trong những hang động đẹp nhất Đông Nam Á với hệ thống thạch nhũ triệu năm tuổi. Trước khi đến, hãy chuẩn bị:

1. Trang phục: Mặc quần áo thoải mái, giày bám chắc. Nhiệt độ trong hang thường mát 18-20°C.
2. Thiết bị: Đèn pin dự phòng, áo mưa mỏng, túi đựng đồ không thấm nước.
3. Sức khỏe: Không phù hợp với người bị tim mạch nặng hoặc claustrophobia.
4. Thời gian tốt nhất: Tháng 2-8 khi mùa khô, tránh mùa mưa (tháng 9-11).

Hướng dẫn viên sẽ đồng hành xuyên suốt hành trình 90 phút, chia sẻ về lịch sử địa chất và những câu chuyện thú vị về hang động.',
  'guide',
  'HDV Nguyễn Văn Minh',
  true,
  now() - interval '5 days'
),
(
  'Top 5 món ăn đặc sản không thể bỏ lỡ tại Quảng Bình',
  'mon-an-dac-san-quang-binh',
  'Ẩm thực Quảng Bình đậm đà bản sắc miền Trung — từ bánh xèo giòn rụm đến cháo canh thơm lừng, mỗi món là một câu chuyện.',
  'Quảng Bình nổi tiếng không chỉ vì hang động mà còn vì nền ẩm thực phong phú:

1. **Bánh xèo Đồng Hới** — Bánh giòn tan, nhân tôm-thịt-giá đỗ, chấm nước mắm chua ngọt.
2. **Cháo canh** — Canh cá hoặc hải sản nấu với bún tươi, rau thơm. Món ăn sáng đặc trưng của người địa phương.
3. **Nem lui** — Thịt nướng cuốn bánh tráng với rau sống, chấm tương đậu đặc biệt.
4. **Cơm hến** — Cơm trắng ăn với hến xào cay, tương bần và rau húng.
5. **Chè khoai** — Chè ngọt từ khoai lang, đậu xanh, thích hợp tráng miệng sau bữa ăn.

AMF-ECO Resort phục vụ đầy đủ các món đặc sản này tại nhà hàng khu resort.',
  'food',
  'Đầu bếp Lê Thị Hoa',
  true,
  now() - interval '2 days'
),
(
  'Mùa hè 2025 — Chương trình ưu đãi đặc biệt',
  'uu-dai-mua-he-2025',
  'Giảm 20% tất cả tour hồ bơi thiên nhiên trong tháng 6-8. Đặt nhóm từ 10 người, tặng thêm 1 tour miễn phí.',
  'Chào mừng mùa hè 2025! AMF-ECO Resort triển khai loạt ưu đãi hấp dẫn:

**Ưu đãi Hồ Bơi Thiên Nhiên:**
- Giảm 20% giá vé cho tất cả các hồ bơi: Hồ Tiên, Hồ Ngọc Xanh
- Áp dụng từ 01/06 đến 31/08/2025
- Không giới hạn số lượng vé

**Ưu đãi Nhóm:**
- Đặt từ 10 người trở lên: tặng 1 vé miễn phí
- Đặt từ 20 người: tặng 2 vé + 1 bữa trưa buffet

**Gói Family Weekend:**
- 2 người lớn + 2 trẻ em: giảm 15% tổng hóa đơn
- Áp dụng thứ 7, chủ nhật và ngày lễ

Đặt vé ngay để đảm bảo suất — số lượng có hạn mỗi ngày!',
  'news',
  'AMF-ECO Team',
  true,
  now() - interval '1 day'
);
