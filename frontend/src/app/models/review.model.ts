export interface GymBrand {
  id: number;
  name: string;
  totalLocations: number;
}

export interface Review {
  id: number;
  gymBrand: GymBrand;
  rating: number;
  ratingDecimal: number;
  priceInfo: string;
  pros: string;
  cons: string;
  content: string;
  authorName: string;
  isExpert: boolean;
  createdAt: string;
  updatedAt: string;
}
