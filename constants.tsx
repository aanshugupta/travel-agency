
import React from 'react';
import type { TravelPackage, User, Booking } from './types';

export const MOCK_PACKAGES: TravelPackage[] = [
  {
    id: '1',
    name: 'Kyoto\'s Serene Temples',
    destination: 'Kyoto, Japan',
    duration: 7,
    price: 2500,
    rating: 4.8,
    description: 'Immerse yourself in the ancient culture of Kyoto. Visit serene temples, walk through bamboo forests, and experience a traditional tea ceremony.',
    image: 'https://picsum.photos/seed/kyoto/800/600',
    tags: ['culture', 'history', 'nature'],
  },
  {
    id: '2',
    name: 'Santorini Sunset Escape',
    destination: 'Santorini, Greece',
    duration: 5,
    price: 3200,
    rating: 4.9,
    description: 'Witness the world-famous sunsets of Santorini. Explore the charming white-washed villages and relax on unique volcanic beaches.',
    image: 'https://picsum.photos/seed/santorini/800/600',
    tags: ['romance', 'beach', 'luxury'],
  },
  {
    id: '3',
    name: 'Machu Picchu Adventure',
    destination: 'Cusco, Peru',
    duration: 10,
    price: 4500,
    rating: 4.7,
    description: 'Hike the legendary Inca Trail to the lost city of Machu Picchu. A true adventure for thrill-seekers and history buffs.',
    image: 'https://picsum.photos/seed/machupicchu/800/600',
    tags: ['adventure', 'hiking', 'history'],
  },
  {
    id: '4',
    name: 'Northern Lights Spectacle',
    destination: 'Tromsø, Norway',
    duration: 6,
    price: 3800,
    rating: 4.9,
    description: 'Chase the elusive Aurora Borealis in the Arctic circle. Enjoy dog sledding, reindeer feeding, and stunning fjord landscapes.',
    image: 'https://picsum.photos/seed/norway/800/600',
    tags: ['winter', 'nature', 'adventure'],
  },
    {
    id: '5',
    name: 'Swiss Alps Grandeur',
    destination: 'Interlaken, Switzerland',
    duration: 8,
    price: 4200,
    rating: 4.8,
    description: 'Experience the breathtaking beauty of the Swiss Alps. From scenic train rides to exhilarating mountain peaks, it\'s a nature lover\'s dream.',
    image: 'https://picsum.photos/seed/switzerland/800/600',
    tags: ['mountains', 'nature', 'hiking'],
  },
  {
    id: '6',
    name: 'New York City Lights',
    destination: 'New York, USA',
    duration: 5,
    price: 2800,
    rating: 4.6,
    description: 'Explore the city that never sleeps. See iconic landmarks, catch a Broadway show, and indulge in world-class cuisine.',
    image: 'https://picsum.photos/seed/newyork/800/600',
    tags: ['city', 'culture', 'food'],
  },
];

export const MOCK_USER: User = {
  id: 'user123',
  name: 'Alex Wanderer',
  email: 'alex.wanderer@example.com',
  loyaltyPoints: 1500,
};

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'booking1',
    packageId: '1',
    packageName: 'Kyoto\'s Serene Temples',
    userId: 'user123',
    bookingDate: '2024-05-10',
    tripDate: '2024-09-15',
    travelers: 2,
    status: 'upcoming',
  },
  {
    id: 'booking2',
    packageId: '3',
    packageName: 'Machu Picchu Adventure',
    userId: 'user123',
    bookingDate: '2023-11-20',
    tripDate: '2024-03-01',
    travelers: 1,
    status: 'completed',
  },
    {
    id: 'booking3',
    packageId: '4',
    packageName: 'Northern Lights Spectacle',
    userId: 'user123',
    bookingDate: '2024-06-01',
    tripDate: '2024-12-20',
    travelers: 2,
    status: 'upcoming',
  },
];

export const Icons = {
  Sun: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
  ),
  Moon: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
  ),
  Logo: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M17.5 2.5a2.5 2.5 0 0 0-4.48-1.55l-5.43 9.42a2.5 2.5 0 0 0 0 2.26l5.43 9.42a2.5 2.5 0 0 0 4.48-1.55V2.5Z"/><path d="M6.5 2.5a2.5 2.5 0 0 0-4.48-1.55L.59 10.37a2.5 2.5 0 0 0 0 2.26l1.43 2.48a2.5 2.5 0 0 0 4.48-1.55V2.5Z"/><path d="M23.41 10.37a2.5 2.5 0 0 0-4.48-1.55l-1.43 2.48a2.5 2.5 0 0 0 0 2.26l1.43 2.48a2.5 2.5 0 0 0 4.48-1.55Z"/></svg>
  ),
  Search: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
  ),
  Star: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
  ),
  MapPin: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
  ),
  Calendar: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>
  ),
  Users: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  ),
   Sparkles: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12 3-1.9 5.8-5.8 1.9 5.8 1.9 1.9 5.8 1.9-5.8 5.8-1.9-5.8-1.9Z"/></svg>
  ),
  Car: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><path d="M7 17h10"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="16.5" cy="17.5" r="2.5"/></svg>
  ),
};
