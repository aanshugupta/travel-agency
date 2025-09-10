
export interface TravelPackage {
  id: string;
  name: string;
  destination: string;
  duration: number; // in days
  price: number;
  rating: number;
  description: string;
  image: string;
  tags: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  loyaltyPoints: number;
}

export interface Booking {
  id: string;
  packageId: string;
  packageName: string;
  userId: string;
  bookingDate: string;
  tripDate: string;
  travelers: number;
  status: 'upcoming' | 'completed' | 'cancelled';
}

export interface ItineraryDay {
    day: number;
    title: string;
    activities: string[];
}

export interface AITripPlan {
    destination: string;
    duration: number;
    itinerary: ItineraryDay[];
}
