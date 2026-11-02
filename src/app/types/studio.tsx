// Shape of one studio, exactly as the Express server returns it.
// Keeping it in one file means every page uses the same definition.
export type Studio = {
  _id: string;
  title: string;
  category: string;
  hourlyRate: number;
  securityDeposit: number;
  maxCapacity: number;
  location: string;
  rating: number;
  reviewsCount: number;
  image: string;
  gallery: string[];
  amenities: string[];
  overview: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhoto: string;
  createdAt: string;
};