CREATE DATABASE IF NOT EXISTS eshop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE eshop;

CREATE TABLE IF NOT EXISTS categories (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(64) NOT NULL UNIQUE,
  name VARCHAR(128) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS products (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  category_id INT UNSIGNED NOT NULL,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  detail TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories (id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

INSERT INTO categories (slug, name) VALUES
  ('cup', '馬克杯'),
  ('badge', '徽章'),
  ('shirt', '衣服')
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO products (category_id, name, price, image_url, detail)
SELECT c.id, v.name, v.price, v.image_url, v.detail
FROM (
  SELECT 'cup' AS slug, '品牌馬克杯' AS name, 390 AS price,
         'https://images.unsplash.com/photo-1498804103079-a6351b050096?q=80&w=1200&auto=format&fit=crop' AS image_url,
         '品牌馬克杯' AS detail
  UNION ALL
  SELECT 'badge', '品牌徽章', 180,
         'https://images.unsplash.com/photo-1518998053901-5348d3961a04?q=80&w=1200&auto=format&fit=crop',
         '品牌徽章'
  UNION ALL
  SELECT 'shirt', '品牌 T-Shirt', 690,
         'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200&auto=format&fit=crop',
         '品牌 T-Shirt'
  UNION ALL
  SELECT 'badge', '貼紙組合', 120,
         'https://images.unsplash.com/photo-1560472355-536de3962603?q=80&w=1200&auto=format&fit=crop',
         '貼紙組合'
  UNION ALL
  SELECT 'shirt', 'Logo 帆布袋', 520,
         'https://images.unsplash.com/photo-1604176424472-17cd740f74e9?q=80&w=1200&auto=format&fit=crop',
         'Logo 帆布袋'
) AS v
JOIN categories c ON c.slug = v.slug
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  image_url = VALUES(image_url),
  detail = VALUES(detail);
