// /Users/azriel/Project/bissolf/src/data.ts

import type { Product } from './types';

export const dummyProducts: Product[] = [
  { 
    id: '1', 
    product_name: 'Kopi Arabika Gayo', 
    product_sku: 'KOP-001', 
    price: 75000, 
    stocks: 45, 
    brand: 'Bissolf', 
    category: 'Coffee', 
    description: 'Kopi premium dari dataran tinggi Gayo, aroma floral dan rasa fruity.', 
    image_url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300',
    variants: [
      { 
        name: 'Gilingan', 
        options: [
          { name: 'Biji Utuh', image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=80' },
          { name: 'Bubuk Halus', image: 'https://images.unsplash.com/photo-1646346835113-b83a4097983b?w=80' },
          { name: 'Bubuk Kasar', image: 'https://images.unsplash.com/photo-1517254456976-ee8682099819?w=80' }
        ] 
      },
      { 
        name: 'Roasting', 
        options: [
          { name: 'Medium', image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=80' },
          { name: 'Dark', image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=80' }
        ] 
      }
    ]
  },
  { 
    id: '2', 
    product_name: 'Kaos Polos Black', 
    product_sku: 'KAS-002', 
    price: 120000, 
    stocks: 12, 
    brand: 'Bissolf', 
    category: 'Apparel', 
    description: 'Kaos polos cotton combed 30s, nyaman dipakai sehari-hari.', 
    image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300',
    variants: [
      { 
        name: 'Size', 
        options: [
          { name: 'S' },
          { name: 'M' },
          { name: 'L' },
          { name: 'XL' }
        ] 
      }
    ]
  },
  { 
    id: '3', 
    product_name: 'Bluetooth Speaker', 
    product_sku: 'ELC-003', 
    price: 450000, 
    stocks: 3, 
    brand: 'Sony', 
    category: 'Electronics', 
    description: 'Speaker portable dengan bass mantap dan tahan air IPX7.', 
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300',
    variants: [
      { 
        name: 'Warna', 
        options: [
          { name: 'Hitam', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80' },
          { name: 'Merah', image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=80' },
          { name: 'Biru', image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=80' }
        ] 
      }
    ]
  },
  { 
    id: '4', 
    product_name: 'Tumbler Vacuum', 
    product_sku: 'ACC-004', 
    price: 85000, 
    stocks: 25, 
    brand: 'Bissolf', 
    category: 'Accessories', 
    description: 'Tumbler stainless steel 500ml, tahan panas & dingin hingga 12 jam.', 
    image_url: 'https://images.unsplash.com/photo-1517254456976-ee8682099819?w=300',
    variants: [
      { 
        name: 'Warna', 
        options: [
          { name: 'Silver', image: 'https://images.unsplash.com/photo-1517254456976-ee8682099819?w=80' },
          { name: 'Black Matte', image: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=80' },
          { name: 'Gold' }
        ] 
      }
    ]
  },
  { 
    id: '5', 
    product_name: 'Kopi Robusta Lampung', 
    product_sku: 'KOP-005', 
    price: 60000, 
    stocks: 30, 
    brand: 'Bissolf', 
    category: 'Coffee', 
    description: 'Robusta Lampung dengan body tebal dan aftertaste coklat.', 
    image_url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300',
    variants: [
      { 
        name: 'Gilingan', 
        options: [
          { name: 'Biji Utuh', image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=80' },
          { name: 'Bubuk', image: 'https://images.unsplash.com/photo-1646346835113-b83a4097983b?w=80' }
        ] 
      }
    ]
  },
  { 
    id: '6', 
    product_name: 'Hoodie Oversize', 
    product_sku: 'KAS-006', 
    price: 250000, 
    stocks: 8, 
    brand: 'Bissolf', 
    category: 'Apparel', 
    description: 'Hoodie oversize cotton fleece, sangat nyaman dan hangat.', 
    image_url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300',
    variants: [
      { 
        name: 'Size', 
        options: [
          { name: 'M' },
          { name: 'L' },
          { name: 'XL' }
        ] 
      },
      { 
        name: 'Warna', 
        options: [
          { name: 'Abu Misty', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=80' },
          { name: 'Hitam', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=80' },
          { name: 'Navy', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=80' }
        ] 
      }
    ]
  },
  { 
    id: '7', 
    product_name: 'Mechanical Keyboard', 
    product_sku: 'ELC-007', 
    price: 890000, 
    stocks: 15, 
    brand: 'Keychron', 
    category: 'Electronics', 
    description: 'Keyboard mechanical RGB hot-swappable, layout TKL.', 
    image_url: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=300',
    variants: [
      { 
        name: 'Switch', 
        options: [
          { name: 'Red' },
          { name: 'Blue' },
          { name: 'Brown' }
        ] 
      }
    ]
  },
  { 
    id: '8', 
    product_name: 'Leather Wallet', 
    product_sku: 'ACC-008', 
    price: 175000, 
    stocks: 20, 
    brand: 'Bissolf', 
    category: 'Accessories', 
    description: 'Dompet kulit asli slim dengan 8 slot kartu.', 
    image_url: 'https://wia.id/media/catalog/product/cache/wia_id_slimfold_mini_slim-leather_wallet-4_copy80080025.webp'
    // Tidak ada variants
  },
  { 
    id: '9', 
    product_name: 'Espresso Maker', 
    product_sku: 'ELC-009', 
    price: 1250000, 
    stocks: 5, 
    brand: 'DeLonghi', 
    category: 'Electronics', 
    description: 'Mesin espresso semi-otomatis untuk home barista.', 
    image_url: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=300' 
    // Tidak ada variants
  },
  { 
    id: '10', 
    product_name: 'Totebag Kanvas', 
    product_sku: 'ACC-010', 
    price: 45000, 
    stocks: 100, 
    brand: 'Bissolf', 
    category: 'Accessories', 
    description: 'Totebag kanvas tebal 12 oz, ramah lingkungan.', 
    image_url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=300',
    variants: [
      { 
        name: 'Motif', 
        options: [
          { name: 'Polos', image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=80' },
          { name: 'Abstract', image: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=80' },
          { name: 'Quote' }
        ] 
      }
    ]
  },
  { 
    id: '11', 
    product_name: 'Kopi Luwak', 
    product_sku: 'KOP-011', 
    price: 500000, 
    stocks: 10, 
    brand: 'Bissolf', 
    category: 'Coffee', 
    description: 'Kopi luwak asli dengan rasa unik dan rendah asam.', 
    image_url: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=300' 
    // Tidak ada variants
  },
  { 
    id: '12', 
    product_name: 'Jeans Denim', 
    product_sku: 'KAS-012', 
    price: 320000, 
    stocks: 22, 
    brand: 'Bissolf', 
    category: 'Apparel', 
    description: 'Celana jeans slim fit stretch denim premium.', 
    image_url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300',
    variants: [
      { 
        name: 'Size', 
        options: [
          { name: '28' },
          { name: '30' },
          { name: '32' },
          { name: '34' }
        ] 
      },
      { 
        name: 'Warna', 
        options: [
          { name: 'Light Blue', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=80' },
          { name: 'Deep Blue', image: 'https://images.unsplash.com/photo-1602293589930-45aad59ba3ab?w=80' },
          { name: 'Black' }
        ] 
      }
    ]
  },
  { 
    id: '13', 
    product_name: 'Mouse Gaming', 
    product_sku: 'ELC-013', 
    price: 550000, 
    stocks: 18, 
    brand: 'Logitech', 
    category: 'Electronics', 
    description: 'Mouse gaming wireless dengan sensor HERO 25K DPI.', 
    image_url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300' 
    // Tidak ada variants
  },
  { 
    id: '14', 
    product_name: 'Topi Baseball', 
    product_sku: 'ACC-014', 
    price: 95000, 
    stocks: 40, 
    brand: 'Bissolf', 
    category: 'Accessories', 
    description: 'Topi baseball snapback adjustable, bahan cotton twill.', 
    image_url: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=300',
    variants: [
      { 
        name: 'Warna', 
        options: [
          { name: 'Hitam', image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=80' },
          { name: 'Putih' },
          { name: 'Navy' },
          { name: 'Maroon' }
        ] 
      }
    ]
  },
  { 
    id: '15', 
    product_name: 'Cold Brew Botol', 
    product_sku: 'KOP-015', 
    price: 35000, 
    stocks: 50, 
    brand: 'Bissolf', 
    category: 'Coffee', 
    description: 'Cold brew siap minum dalam botol kaca 250ml.', 
    image_url: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300',
    variants: [
      { 
        name: 'Rasa', 
        options: [
          { name: 'Original', image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=80' },
          { name: 'Caramel' },
          { name: 'Hazelnut' }
        ] 
      }
    ]
  },
  { 
    id: '16', 
    product_name: 'Sandal Slide', 
    product_sku: 'KAS-016', 
    price: 150000, 
    stocks: 30, 
    brand: 'Bissolf', 
    category: 'Apparel', 
    description: 'Sandal slide unisex dengan sol empuk EVA.', 
    image_url: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=300',
    variants: [
      { 
        name: 'Size', 
        options: [
          { name: '39' },
          { name: '40' },
          { name: '41' },
          { name: '42' },
          { name: '43' }
        ] 
      }
    ]
  },
  { 
    id: '17', 
    product_name: 'Webcam 4K', 
    product_sku: 'ELC-017', 
    price: 750000, 
    stocks: 12, 
    brand: 'Bissolf', 
    category: 'Electronics', 
    description: 'Webcam 4K UHD dengan mikrofon noise-canceling.', 
    image_url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300' 
    // Tidak ada variants
  },
  { 
    id: '18', 
    product_name: 'Notebook A5', 
    product_sku: 'ACC-018', 
    price: 55000, 
    stocks: 60, 
    brand: 'Bissolf', 
    category: 'Accessories', 
    description: 'Buku catatan A5 hardcover 100 lembar premium.', 
    image_url: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=300',
    variants: [
      { 
        name: 'Cover', 
        options: [
          { name: 'Hitam', image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=80' },
          { name: 'Coklat' },
          { name: 'Navy' }
        ] 
      },
      { 
        name: 'Isi', 
        options: [
          { name: 'Garis' },
          { name: 'Polos' },
          { name: 'Dotted' }
        ] 
      }
    ]
  },
  { 
    id: '19', 
    product_name: 'Kopi Toraja', 
    product_sku: 'KOP-019', 
    price: 80000, 
    stocks: 25, 
    brand: 'Bissolf', 
    category: 'Coffee', 
    description: 'Kopi Toraja dengan body penuh dan hint herbal.', 
    image_url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300',
    variants: [
      { 
        name: 'Gilingan', 
        options: [
          { name: 'Biji', image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=80' },
          { name: 'Bubuk' }
        ] 
      }
    ]
  },
  { 
    id: '20', 
    product_name: 'Kemeja Flanel', 
    product_sku: 'KAS-020', 
    price: 210000, 
    stocks: 14, 
    brand: 'Bissolf', 
    category: 'Apparel', 
    description: 'Kemeja flanel kotak-kotak bahan cotton brushed.', 
    image_url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300',
    variants: [
      { 
        name: 'Size', 
        options: [
          { name: 'M' },
          { name: 'L' },
          { name: 'XL' }
        ] 
      },
      { 
        name: 'Warna', 
        options: [
          { name: 'Merah Kotak', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=80' },
          { name: 'Biru Kotak' },
          { name: 'Hijau Kotak' }
        ] 
      }
    ]
  },
  { 
    id: '21', 
    product_name: 'Monitor 24 inch', 
    product_sku: 'ELC-021', 
    price: 1800000, 
    stocks: 4, 
    brand: 'Asus', 
    category: 'Electronics', 
    description: 'Monitor gaming 24" IPS 144Hz Full HD.', 
    image_url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300' 
    // Tidak ada variants
  },
  { 
    id: '22', 
    product_name: 'Payung Lipat', 
    product_sku: 'ACC-022', 
    price: 120000, 
    stocks: 15, 
    brand: 'Bissolf', 
    category: 'Accessories', 
    description: 'Payung lipat 3 sekat anti angin dengan auto open.', 
    image_url: 'https://cdn.ruparupa.io/fit-in/400x400/filters:format(webp)/filters:quality(90)/ruparupa-com/image/upload/Products/10518508_1.jpg' 
    // Tidak ada variants
  },
  { 
    id: '23', 
    product_name: 'Kopi Mandailing', 
    product_sku: 'KOP-023', 
    price: 70000, 
    stocks: 35, 
    brand: 'Bissolf', 
    category: 'Coffee', 
    description: 'Kopi Mandailing dengan rasa manis alami dan acidity rendah.', 
    image_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=300',
    variants: [
      { 
        name: 'Gilingan', 
        options: [
          { name: 'Biji', image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=80' },
          { name: 'Bubuk' }
        ] 
      }
    ]
  },
  { 
    id: '24', 
    product_name: 'Jaket Bomber', 
    product_sku: 'KAS-024', 
    price: 350000, 
    stocks: 9, 
    brand: 'Bissolf', 
    category: 'Apparel', 
    description: 'Jaket bomber waterproof dengan lining hangat.', 
    image_url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300',
    variants: [
      { 
        name: 'Size', 
        options: [
          { name: 'M' },
          { name: 'L' },
          { name: 'XL' }
        ] 
      },
      { 
        name: 'Warna', 
        options: [
          { name: 'Army Green', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=80' },
          { name: 'Black' },
          { name: 'Navy' }
        ] 
      }
    ]
  }
];