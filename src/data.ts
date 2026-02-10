// F:\projectan\bissolf\src\data.ts

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
          { name: 'Biji Utuh', image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=80', stock: 15, option_price: 0 },
          { name: 'Bubuk Halus', image: 'https://images.unsplash.com/photo-1646346835113-b83a4097983b?w=80', stock: 20, option_price: 0 },
          { name: 'Bubuk Kasar', image: 'https://images.unsplash.com/photo-1517254456976-ee8682099819?w=80', stock: 10, option_price: 0 }
        ] 
      },
      { 
        name: 'Roasting', 
        options: [
          { name: 'Medium', image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=80', stock: 25, option_price: 0 },
          { name: 'Dark', image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=80', stock: 20, option_price: 5000 } // Contoh: Dark roast lebih mahal
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
          { name: 'S', stock: 3, option_price: 0 },
          { name: 'M', stock: 4, option_price: 0 },
          { name: 'L', stock: 3, option_price: 0 },
          { name: 'XL', stock: 2, option_price: 10000 } // Size XL tambah 10rb
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
          { name: 'Hitam', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80', stock: 1, option_price: 0 },
          { name: 'Merah', image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=80', stock: 1, option_price: 0 },
          { name: 'Biru', image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=80', stock: 1, option_price: 0 }
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
          { name: 'Silver', image: 'https://images.unsplash.com/photo-1517254456976-ee8682099819?w=80', stock: 10, option_price: 0 },
          { name: 'Black Matte', image: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=80', stock: 10, option_price: 5000 },
          { name: 'Gold', stock: 5, option_price: 15000 } // Gold edisi premium
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
          { name: 'Biji Utuh', image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=80', stock: 15, option_price: 0 },
          { name: 'Bubuk', image: 'https://images.unsplash.com/photo-1646346835113-b83a4097983b?w=80', stock: 15, option_price: 0 }
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
          { name: 'M', stock: 3, option_price: 0 },
          { name: 'L', stock: 3, option_price: 0 },
          { name: 'XL', stock: 2, option_price: 20000 }
        ] 
      },
      { 
        name: 'Warna', 
        options: [
          { name: 'Abu Misty', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=80', stock: 3, option_price: 0 },
          { name: 'Hitam', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=80', stock: 3, option_price: 0 },
          { name: 'Navy', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=80', stock: 2, option_price: 0 }
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
          { name: 'Red', stock: 5, option_price: 0 },
          { name: 'Blue', stock: 5, option_price: 0 },
          { name: 'Brown', stock: 5, option_price: 35000 } // Switch Brown biasanya lebih favorit/mahal
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
          { name: 'Polos', image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=80', stock: 40, option_price: 0 },
          { name: 'Abstract', image: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=80', stock: 30, option_price: 10000 },
          { name: 'Quote', stock: 30, option_price: 5000 }
        ] 
      }
    ]
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
          { name: '28', stock: 5, option_price: 0 },
          { name: '30', stock: 6, option_price: 0 },
          { name: '32', stock: 6, option_price: 0 },
          { name: '34', stock: 5, option_price: 15000 }
        ] 
      },
      { 
        name: 'Warna', 
        options: [
          { name: 'Light Blue', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=80', stock: 8, option_price: 0 },
          { name: 'Deep Blue', image: 'https://images.unsplash.com/photo-1602293589930-45aad59ba3ab?w=80', stock: 8, option_price: 0 },
          { name: 'Black', stock: 6, option_price: 0 }
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
          { name: 'Original', image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=80', stock: 20, option_price: 0 },
          { name: 'Caramel', stock: 15, option_price: 5000 },
          { name: 'Hazelnut', stock: 15, option_price: 5000 }
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
          { name: '39', stock: 6, option_price: 0 },
          { name: '40', stock: 6, option_price: 0 },
          { name: '41', stock: 6, option_price: 0 },
          { name: '42', stock: 6, option_price: 0 },
          { name: '43', stock: 6, option_price: 0 }
        ] 
      }
    ]
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
          { name: 'Hitam', image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=80', stock: 20, option_price: 0 },
          { name: 'Coklat', stock: 20, option_price: 0 },
          { name: 'Navy', stock: 20, option_price: 0 }
        ] 
      },
      { 
        name: 'Isi', 
        options: [
          { name: 'Garis', stock: 20, option_price: 0 },
          { name: 'Polos', stock: 20, option_price: 0 },
          { name: 'Dotted', stock: 20, option_price: 5000 }
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
          { name: 'M', stock: 5, option_price: 0 },
          { name: 'L', stock: 5, option_price: 0 },
          { name: 'XL', stock: 4, option_price: 15000 }
        ] 
      },
      { 
        name: 'Warna', 
        options: [
          { name: 'Merah Kotak', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=80', stock: 5, option_price: 0 },
          { name: 'Biru Kotak', stock: 5, option_price: 0 },
          { name: 'Hijau Kotak', stock: 4, option_price: 0 }
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
          { name: 'M', stock: 3, option_price: 0 },
          { name: 'L', stock: 3, option_price: 0 },
          { name: 'XL', stock: 3, option_price: 25000 }
        ] 
      },
      { 
        name: 'Warna', 
        options: [
          { name: 'Army Green', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=80', stock: 3, option_price: 0 },
          { name: 'Black', stock: 3, option_price: 0 },
          { name: 'Navy', stock: 3, option_price: 0 }
        ] 
      }
    ]
  }
];
