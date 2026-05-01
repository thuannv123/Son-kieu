-- Thêm giá trị REFUNDED vào enum booking_status
ALTER TYPE booking_status ADD VALUE IF NOT EXISTS 'REFUNDED';
