export interface GymBrand {
  id: number;
  name: string;
  totalLocations: number;
  country?: string;
  website?: string;
  type?: string;
}

export interface UserCommentRequest {
  brandId: number;
  rating: number;
  comment: string;
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
  reviewAccuracyScore?: number;
  createdAt: string;
  updatedAt: string;
}
