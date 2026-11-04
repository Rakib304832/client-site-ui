// Shape of one studio, exactly as the Express server returns it.
// Keeping it in one file means every page uses the same definition.
export type Review = {
  _id?: string;
  userId?: string;
  userName: string;
  userPhoto?: string;
  rating: number;
  comment: string;
  createdAt: string;
};

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
  ownerId?: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhoto: string;
  createdAt: string;
  updatedAt?: string;
  reviews?: Review[];
};

export type BookingStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";

export type Booking = {
  _id: string;
  studioId: string;
  studioTitle: string;
  studioImage: string;
  studioCategory: string;
  studioLocation: string;
  ownerEmail: string;
  userId: string;
  userName: string;
  userEmail: string;
  startTime: string;
  endTime: string;
  hours: number;
  guests?: number;
  totalPrice: number;
  status: BookingStatus;
  createdAt: string;
  updatedAt?: string;
};

export const STUDIO_CATEGORIES = [
  "Photo Studio",
  "Film Stage",
  "Podcast Lounge",
  "Music Suite",
  "Workshop",
] as const;
