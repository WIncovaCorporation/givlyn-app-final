export interface TrendingProduct {
  id: string;
  productName: string;
  imageUrl: string;
  price: number;
  originalPrice?: number;
  discount?: string;
  storeName: string;
  affiliateLink: string;
}

const mockTrendingProducts: TrendingProduct[] = [
  {
    id: 'TND001',
    productName: 'AirPods Pro 2',
    imageUrl: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=300&q=80',
    price: 249,
    originalPrice: 299,
    discount: '-15%',
    storeName: 'Amazon',
    affiliateLink: 'https://www.amazon.com/dp/B0CHWRXH8B?tag=givlyn-20',
  },
  {
    id: 'TND002',
    productName: 'Stanley Tumbler',
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300&q=80',
    price: 45,
    originalPrice: 55,
    discount: '-20%',
    storeName: 'Target',
    affiliateLink: 'https://www.target.com/?ref=givlyn',
  },
  {
    id: 'TND003',
    productName: 'Kindle Paperwhite',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&q=80',
    price: 139,
    originalPrice: 179,
    discount: '-25%',
    storeName: 'Amazon',
    affiliateLink: 'https://www.amazon.com/dp/B09TMN58KL?tag=givlyn-20',
  },
  {
    id: 'TND004',
    productName: 'Dyson Airwrap',
    imageUrl: 'https://images.unsplash.com/photo-1522338242042-2d1c27096969?w=300&q=80',
    price: 599,
    storeName: 'Best Buy',
    affiliateLink: 'https://www.bestbuy.com/?ref=givlyn',
  },
  {
    id: 'TND005',
    productName: 'Lego Architecture',
    imageUrl: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=300&q=80',
    price: 129,
    originalPrice: 149,
    discount: '-10%',
    storeName: 'Amazon',
    affiliateLink: 'https://www.amazon.com/?tag=givlyn-20',
  },
  {
    id: 'TND006',
    productName: 'Nintendo Switch',
    imageUrl: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=300&q=80',
    price: 299,
    storeName: 'Walmart',
    affiliateLink: 'https://www.walmart.com/?affiliates_ad_id=givlyn',
  },
  {
    id: 'TND007',
    productName: 'Apple Watch SE',
    imageUrl: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=300&q=80',
    price: 249,
    originalPrice: 279,
    discount: '-11%',
    storeName: 'Amazon',
    affiliateLink: 'https://www.amazon.com/?tag=givlyn-20',
  },
  {
    id: 'TND008',
    productName: 'Instant Pot Duo',
    imageUrl: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=300&q=80',
    price: 89,
    originalPrice: 120,
    discount: '-26%',
    storeName: 'Amazon',
    affiliateLink: 'https://www.amazon.com/?tag=givlyn-20',
  },
  {
    id: 'TND009',
    productName: 'Sony WH-1000XM5',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80',
    price: 348,
    originalPrice: 399,
    discount: '-13%',
    storeName: 'Best Buy',
    affiliateLink: 'https://www.bestbuy.com/?ref=givlyn',
  },
  {
    id: 'TND010',
    productName: 'Yeti Cooler',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&q=80',
    price: 275,
    storeName: 'Amazon',
    affiliateLink: 'https://www.amazon.com/?tag=givlyn-20',
  },
];

export const getTrendingProducts = async (): Promise<TrendingProduct[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockTrendingProducts;
};

export const getTrendingProductsSync = (): TrendingProduct[] => {
  return mockTrendingProducts;
};
