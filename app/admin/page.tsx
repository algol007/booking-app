"use client"

import { useState } from 'react';
import { getAllBookings, getAllBuildings, updateBookingStatus } from '@/lib/dummy-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Building2, Calendar, Users, Settings } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('bookings');
  const { toast } = useToast();
  const bookings = getAllBookings();
  const buildings = getAllBuildings();

  const handleStatusUpdate = (bookingId: string, newStatus: 'approved' | 'rejected') => {
    updateBookingStatus(bookingId, newStatus);
    toast({
      title: `Booking ${newStatus}`,
      description: `The booking has been ${newStatus}`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-6">
      <div className="container mx-auto">
        <div className="flex items-center space-x-2 mb-8">
          <Settings className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="bookings" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Bookings</span>
            </TabsTrigger>
            <TabsTrigger value="buildings" className="flex items-center space-x-2">
              <Building2 className="h-4 w-4" />
              <span>Buildings</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Users</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Booking Requests</CardTitle>
                <CardDescription>Manage all venue booking requests</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Building</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking) => {
                      const building = buildings.find(b => b.id === booking.buildingId);
                      return (
                        <TableRow key={booking.id}>
                          <TableCell>{building?.name}</TableCell>
                          <TableCell>
                            {format(new Date(booking.startDate), 'PPP')}
                          </TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                              ${booking.status === 'approved' ? 'bg-green-100 text-green-800' : 
                                booking.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                                'bg-yellow-100 text-yellow-800'}`}>
                              {booking.status}
                            </span>
                          </TableCell>
                          <TableCell>${booking.totalPrice}</TableCell>
                          <TableCell>
                            {booking.status === 'pending' && (
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleStatusUpdate(booking.id, 'approved')}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleStatusUpdate(booking.id, 'rejected')}
                                >
                                  Reject
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="buildings">
            <Card>
              <CardHeader>
                <CardTitle>Building Management</CardTitle>
                <CardDescription>Manage venue details and pricing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {buildings.map((building) => (
                    <Card key={building.id}>
                      <div className="aspect-video relative">
                        <img
                          src={building.image}
                          alt={building.name}
                          className="object-cover w-full h-full rounded-t-lg"
                        />
                      </div>
                      <CardHeader>
                        <CardTitle>{building.name}</CardTitle>
                        <CardDescription>{building.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div>Location: {building.location}</div>
                          <div>Price per day: ${building.pricePerDay}</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage user accounts and roles</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  User management functionality will be implemented in the next phase.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}