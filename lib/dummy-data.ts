export interface User {
  id: string;
  email: string;
  phone: string;
  role: "admin" | "client";
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
  status: "pending" | "approved" | "rejected";
  paymentProof?: string;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
  googleCalendarEventId?: string;
}

export const users: User[] = [
  {
    id: "1",
    email: "admin@example.com",
    phone: "+1234567890",
    role: "admin",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    email: "client@example.com",
    phone: "+1234567891",
    role: "client",
    createdAt: new Date("2024-01-02"),
  },
];

export const buildings: Building[] = [
  {
    id: "1",
    name: "Grand Ballroom",
    description: "Elegant venue perfect for weddings and large events",
    location: "Downtown, City Center",
    pricePerDay: 1000,
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    name: "Conference Center",
    description: "Modern space ideal for business meetings and conferences",
    location: "Business District",
    pricePerDay: 750,
    image: "https://images.unsplash.com/photo-1431540015161-0bf868a2d407",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "3",
    name: "Exhibition Hall",
    description: "Spacious venue for exhibitions and trade shows",
    location: "Convention Center",
    pricePerDay: 1200,
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
];

export const bookings: Booking[] = [
  {
    id: "1",
    buildingId: "1",
    userId: "2",
    startDate: new Date("2024-03-15"),
    endDate: new Date("2024-03-16"),
    status: "approved",
    paymentProof: "payment1.jpg",
    totalPrice: 1000,
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date("2024-03-01"),
    googleCalendarEventId: "event1",
  },
  {
    id: "2",
    buildingId: "2",
    userId: "2",
    startDate: new Date("2024-03-20"),
    endDate: new Date("2024-03-21"),
    status: "pending",
    totalPrice: 750,
    createdAt: new Date("2024-03-05"),
    updatedAt: new Date("2024-03-05"),
  },
];

// Helper functions to simulate database operations
export const findUserByEmail = (email: string) => {
  return users.find((user) => user.email === email);
};

export const findBuildingById = (id: string) => {
  return buildings.find((building) => building.id === id);
};

export const findBookingsByUserId = (userId: string) => {
  return bookings.filter((booking) => booking.userId === userId);
};

export const findBookingById = (id: string) => {
  return bookings.find((booking) => booking.id === id);
};

export const getAllBuildings = () => {
  return buildings;
};

export const getAllBookings = () => {
  return bookings;
};

export const getAllUsers = () => {
  return users;
};

export const createUser = (user: Omit<User, "id" | "createdAt">) => {
  const newUser: User = {
    ...user,
    id: Math.random().toString(36).substr(2, 9),
    createdAt: new Date(),
  };
  users.push(newUser);
  return newUser;
};

export const updateUser = (id: string, data: Partial<User>) => {
  const user = users.find((u) => u.id === id);
  if (user) {
    Object.assign(user, data);
    return user;
  }
  return null;
};

export const deleteUser = (id: string) => {
  const index = users.findIndex((u) => u.id === id);
  if (index !== -1) {
    users.splice(index, 1);
    return true;
  }
  return false;
};

export const createBuilding = (
  building: Omit<Building, "id" | "createdAt" | "updatedAt">
) => {
  const newBuilding: Building = {
    ...building,
    id: Math.random().toString(36).substr(2, 9),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  buildings.push(newBuilding);
  return newBuilding;
};

export const updateBuilding = (id: string, data: Partial<Building>) => {
  const building = buildings.find((b) => b.id === id);
  if (building) {
    Object.assign(building, data, { updatedAt: new Date() });
    return building;
  }
  return null;
};

export const deleteBuilding = (id: string) => {
  const index = buildings.findIndex((b) => b.id === id);
  if (index !== -1) {
    buildings.splice(index, 1);
    return true;
  }
  return false;
};

export const createBooking = (
  booking: Omit<Booking, "id" | "createdAt" | "updatedAt">
) => {
  const newBooking: Booking = {
    ...booking,
    id: Math.random().toString(36).substr(2, 9),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  bookings.push(newBooking);
  return newBooking;
};

export const updateBookingStatus = (id: string, status: Booking["status"]) => {
  const booking = bookings.find((b) => b.id === id);
  if (booking) {
    booking.status = status;
    booking.updatedAt = new Date();
    return booking;
  }
  return null;
};

export const getMonthlyBookingSummary = () => {
  const currentYear = new Date().getFullYear();
  const summary = Array.from({ length: 12 }, (_, month) => {
    const monthBookings = bookings.filter((booking) => {
      const bookingDate = new Date(booking.startDate);
      return (
        bookingDate.getFullYear() === currentYear &&
        bookingDate.getMonth() === month
      );
    });

    return {
      month: new Date(currentYear, month).toLocaleString("default", {
        month: "long",
      }),
      total: monthBookings.length,
      approved: monthBookings.filter((b) => b.status === "approved").length,
      rejected: monthBookings.filter((b) => b.status === "rejected").length,
      pending: monthBookings.filter((b) => b.status === "pending").length,
      revenue: monthBookings
        .filter((b) => b.status === "approved")
        .reduce((sum, b) => sum + b.totalPrice, 0),
    };
  });

  return summary;
};
