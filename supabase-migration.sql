-- ============================================
-- BISSOLF Supabase Migration
-- Jalankan SQL ini di Supabase Dashboard → SQL Editor
-- ============================================

-- 1. Tabel Products
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  product_name TEXT NOT NULL,
  product_sku TEXT UNIQUE NOT NULL,
  price INTEGER NOT NULL DEFAULT 0,
  stocks INTEGER NOT NULL DEFAULT 0,
  brand TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  image TEXT,
  variants JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabel Orders
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  id_product TEXT REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_price INTEGER NOT NULL DEFAULT 0,
  quantity INTEGER NOT NULL DEFAULT 1,
  total_price INTEGER NOT NULL DEFAULT 0,
  buyer_name TEXT NOT NULL,
  buyer_phone TEXT NOT NULL,
  buyer_location TEXT DEFAULT '',
  selected_variants TEXT DEFAULT '',
  variant TEXT DEFAULT '',
  payment_method TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Packaging',
  cancel_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- 4. Policy: Allow all operations for anon (untuk development)
CREATE POLICY "Allow all for anon - products" ON products
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for anon - orders" ON orders
  FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- SEED DATA: 16 Produk BISSOLF
-- ============================================

INSERT INTO products (id, product_name, product_sku, price, stocks, brand, category, description, image, variants) VALUES
('1', 'Kopi Arabika Gayo', 'KOP-001', 75000, 45, 'Bissolf', 'Coffee', 'Kopi premium dari dataran tinggi Gayo, aroma floral dan rasa fruity.', 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300',
  '[{"name":"Gilingan","options":[{"name":"Biji Utuh","image":"https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=80","stock":15,"option_price":0},{"name":"Bubuk Halus","image":"https://images.unsplash.com/photo-1646346835113-b83a4097983b?w=80","stock":20,"option_price":0},{"name":"Bubuk Kasar","image":"https://images.unsplash.com/photo-1517254456976-ee8682099819?w=80","stock":10,"option_price":0}]},{"name":"Roasting","options":[{"name":"Medium","image":"https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=80","stock":25,"option_price":0},{"name":"Dark","image":"https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=80","stock":20,"option_price":5000}]}]'::jsonb),

('2', 'Kaos Polos Black', 'KAS-002', 120000, 12, 'Bissolf', 'Apparel', 'Kaos polos cotton combed 30s, nyaman dipakai sehari-hari.', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300',
  '[{"name":"Size","options":[{"name":"S","stock":3,"option_price":0},{"name":"M","stock":4,"option_price":0},{"name":"L","stock":3,"option_price":0},{"name":"XL","stock":2,"option_price":10000}]}]'::jsonb),

('3', 'Bluetooth Speaker', 'ELC-003', 450000, 3, 'Sony', 'Electronics', 'Speaker portable dengan bass mantap dan tahan air IPX7.', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300',
  '[{"name":"Warna","options":[{"name":"Hitam","image":"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80","stock":1,"option_price":0},{"name":"Merah","image":"https://images.unsplash.com/photo-1583394838336-acd977736f90?w=80","stock":1,"option_price":0},{"name":"Biru","image":"https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=80","stock":1,"option_price":0}]}]'::jsonb),

('4', 'Tumbler Vacuum', 'ACC-004', 85000, 25, 'Bissolf', 'Accessories', 'Tumbler stainless steel 500ml, tahan panas & dingin hingga 12 jam.', 'https://images.unsplash.com/photo-1517254456976-ee8682099819?w=300',
  '[{"name":"Warna","options":[{"name":"Silver","image":"https://images.unsplash.com/photo-1517254456976-ee8682099819?w=80","stock":10,"option_price":0},{"name":"Black Matte","image":"https://images.unsplash.com/photo-1603487742131-4160ec999306?w=80","stock":10,"option_price":5000},{"name":"Gold","stock":5,"option_price":15000}]}]'::jsonb),

('5', 'Kopi Robusta Lampung', 'KOP-005', 60000, 30, 'Bissolf', 'Coffee', 'Robusta Lampung dengan body tebal dan aftertaste coklat.', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300',
  '[{"name":"Gilingan","options":[{"name":"Biji Utuh","image":"https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=80","stock":15,"option_price":0},{"name":"Bubuk","image":"https://images.unsplash.com/photo-1646346835113-b83a4097983b?w=80","stock":15,"option_price":0}]}]'::jsonb),

('6', 'Hoodie Oversize', 'KAS-006', 250000, 8, 'Bissolf', 'Apparel', 'Hoodie oversize cotton fleece, sangat nyaman dan hangat.', 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300',
  '[{"name":"Size","options":[{"name":"M","stock":3,"option_price":0},{"name":"L","stock":3,"option_price":0},{"name":"XL","stock":2,"option_price":20000}]},{"name":"Warna","options":[{"name":"Abu Misty","image":"https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=80","stock":3,"option_price":0},{"name":"Hitam","image":"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=80","stock":3,"option_price":0},{"name":"Navy","image":"https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=80","stock":2,"option_price":0}]}]'::jsonb),

('7', 'Mechanical Keyboard', 'ELC-007', 890000, 15, 'Keychron', 'Electronics', 'Keyboard mechanical RGB hot-swappable, layout TKL.', 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=300',
  '[{"name":"Switch","options":[{"name":"Red","stock":5,"option_price":0},{"name":"Blue","stock":5,"option_price":0},{"name":"Brown","stock":5,"option_price":35000}]}]'::jsonb),

('8', 'Leather Wallet', 'ACC-008', 175000, 20, 'Bissolf', 'Accessories', 'Dompet kulit asli slim dengan 8 slot kartu.', 'https://wia.id/media/catalog/product/cache/wia_id_slimfold_mini_slim-leather_wallet-4_copy80080025.webp',
  '[]'::jsonb),

('10', 'Totebag Kanvas', 'ACC-010', 45000, 100, 'Bissolf', 'Accessories', 'Totebag kanvas tebal 12 oz, ramah lingkungan.', 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=300',
  '[{"name":"Motif","options":[{"name":"Polos","image":"https://images.unsplash.com/photo-1544816155-12df9643f363?w=80","stock":40,"option_price":0},{"name":"Abstract","image":"https://images.unsplash.com/photo-1557683316-973673baf926?w=80","stock":30,"option_price":10000},{"name":"Quote","stock":30,"option_price":5000}]}]'::jsonb),

('12', 'Jeans Denim', 'KAS-012', 320000, 22, 'Bissolf', 'Apparel', 'Celana jeans slim fit stretch denim premium.', 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300',
  '[{"name":"Size","options":[{"name":"28","stock":5,"option_price":0},{"name":"30","stock":6,"option_price":0},{"name":"32","stock":6,"option_price":0},{"name":"34","stock":5,"option_price":15000}]},{"name":"Warna","options":[{"name":"Light Blue","image":"https://images.unsplash.com/photo-1542272604-787c3835535d?w=80","stock":8,"option_price":0},{"name":"Deep Blue","image":"https://images.unsplash.com/photo-1602293589930-45aad59ba3ab?w=80","stock":8,"option_price":0},{"name":"Black","stock":6,"option_price":0}]}]'::jsonb),

('15', 'Cold Brew Botol', 'KOP-015', 35000, 50, 'Bissolf', 'Coffee', 'Cold brew siap minum dalam botol kaca 250ml.', 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300',
  '[{"name":"Rasa","options":[{"name":"Original","image":"https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=80","stock":20,"option_price":0},{"name":"Caramel","stock":15,"option_price":5000},{"name":"Hazelnut","stock":15,"option_price":5000}]}]'::jsonb),

('16', 'Sandal Slide', 'KAS-016', 150000, 30, 'Bissolf', 'Apparel', 'Sandal slide unisex dengan sol empuk EVA.', 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=300',
  '[{"name":"Size","options":[{"name":"39","stock":6,"option_price":0},{"name":"40","stock":6,"option_price":0},{"name":"41","stock":6,"option_price":0},{"name":"42","stock":6,"option_price":0},{"name":"43","stock":6,"option_price":0}]}]'::jsonb),

('18', 'Notebook A5', 'ACC-018', 55000, 60, 'Bissolf', 'Accessories', 'Buku catatan A5 hardcover 100 lembar premium.', 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=300',
  '[{"name":"Cover","options":[{"name":"Hitam","image":"https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=80","stock":20,"option_price":0},{"name":"Coklat","stock":20,"option_price":0},{"name":"Navy","stock":20,"option_price":0}]},{"name":"Isi","options":[{"name":"Garis","stock":20,"option_price":0},{"name":"Polos","stock":20,"option_price":0},{"name":"Dotted","stock":20,"option_price":5000}]}]'::jsonb),

('20', 'Kemeja Flanel', 'KAS-020', 210000, 14, 'Bissolf', 'Apparel', 'Kemeja flanel kotak-kotak bahan cotton brushed.', 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300',
  '[{"name":"Size","options":[{"name":"M","stock":5,"option_price":0},{"name":"L","stock":5,"option_price":0},{"name":"XL","stock":4,"option_price":15000}]},{"name":"Warna","options":[{"name":"Merah Kotak","image":"https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=80","stock":5,"option_price":0},{"name":"Biru Kotak","stock":5,"option_price":0},{"name":"Hijau Kotak","stock":4,"option_price":0}]}]'::jsonb),

('24', 'Jaket Bomber', 'KAS-024', 350000, 9, 'Bissolf', 'Apparel', 'Jaket bomber waterproof dengan lining hangat.', 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300',
  '[{"name":"Size","options":[{"name":"M","stock":3,"option_price":0},{"name":"L","stock":3,"option_price":0},{"name":"XL","stock":3,"option_price":25000}]},{"name":"Warna","options":[{"name":"Army Green","image":"https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=80","stock":3,"option_price":0},{"name":"Black","stock":3,"option_price":0},{"name":"Navy","stock":3,"option_price":0}]}]'::jsonb)

ON CONFLICT (id) DO NOTHING;
