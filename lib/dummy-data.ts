export interface User {
  id: string;
  email: string;
  phone: string;
  role: 'admin' | 'client';
  createdAt: Date;
}

export interface Building {
  id: string;
  name: string;
  description: string;
  location: string;
  pricePerDay: number;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Booking {
  id: string;
  buildingId: string;
  userId: string;
  startDate: Date;
  endDate: Date;
  status: 'pending' | 'approved' | 'rejected';
  paymentProof?: string;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
  googleCalendarEventId?: string;
}

export const users: User[] = [
  {
    id: '1',
    email: 'admin@example.com',
    phone: '+1234567890',
    role: 'admin',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    email: 'client@example.com',
    phone: '+1234567891',
    role: 'client',
    createdAt: new Date('2024-01-02'),
  },
];

export const buildings: Building[] = [
  {
    id: '1',
    name: 'Grand Ballroom',
    description: 'Elegant venue perfect for weddings and large events',
    location: 'Downtown, City Center',
    pricePerDay: 1000,
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'Conference Center',
    description: 'Modern space ideal for business meetings and conferences',
    location: 'Business District',
    pricePerDay: 750,
    image: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '3',
    name: 'Exhibition Hall',
    description: 'Spacious venue for exhibitions and trade shows',
    location: 'Convention Center',
    pricePerDay: 1200,
    image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

export const bookings: Booking[] = [
  {
    id: '1',
    buildingId: '1',
    userId: '2',
    startDate: new Date('2024-03-15'),
    endDate: new Date('2024-03-16'),
    status: 'approved',
    paymentProof: 'payment1.jpg',
    totalPrice: 1000,
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01'),
    googleCalendarEventId: 'event1',
  },
  {
    id: '2',
    buildingId: '2',
    userId: '2',
    startDate: new Date('2024-03-20'),
    endDate: new Date('2024-03-21'),
    status: 'pending',
    totalPrice: 750,
    createdAt: new Date('2024-03-05'),
    updatedAt: new Date('2024-03-05'),
  },
];

// Helper functions to simulate database operations
export const findUserByEmail = (email: string) => {
  return users.find(user => user.email === email);
};

export const findBuildingById = (id: string) => {
  return buildings.find(building => building.id === id);
};

export const findBookingsByUserId = (userId: string) => {
  return bookings.filter(booking => booking.userId === userId);
};

export const findBookingById = (id: string) => {
  return bookings.find(booking => booking.id === id);
};

export const getAllBuildings = () => {
  return buildings;
};

export const getAllBookings = () => {
  return bookings;
};

export const createBooking = (booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>) => {
  const newBooking: Booking = {
    ...booking,
    id: Math.random().toString(36).substr(2, 9),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  bookings.push(newBooking);
  return newBooking;
};

export const updateBookingStatus = (id: string, status: Booking['status']) => {
  const booking = bookings.find(b => b.id === id);
  if (booking) {
    booking.status = status;
    booking.updatedAt = new Date();
    return booking;
  }
  return null;
};