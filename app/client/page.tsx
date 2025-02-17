"use client"

import { useState } from 'react';
import { Building, getAllBuildings, createBooking } from '@/lib/dummy-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Building2, Calendar as CalendarIcon, MapPin, DollarSign } from 'lucide-react';

export default function ClientPage() {
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const { toast } = useToast();
  const buildings = getAllBuildings();

  const handleBooking = (building: Building) => {
    if (!selectedDate) {
      toast({
        title: "Please select a date",
        description: "You need to select a date for your booking",
        variant: "destructive",
      });
      return;
    }

    const endDate = new Date(selectedDate);
    endDate.setDate(endDate.getDate() + 1);

    createBooking({
      buildingId: building.id,
      userId: '2', // Using dummy client ID
      startDate: selectedDate,
      endDate: endDate,
      status: 'pending',
      totalPrice: building.pricePerDay,
    });

    toast({
      title: "Booking Created",
      description: "Your booking request has been submitted for approval",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-6">
      <div className="container mx-auto">
        <div className="flex items-center space-x-2 mb-8">
          <Building2 className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Available Venues</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            {buildings.map((building) => (
              <Card key={building.id} className="overflow-hidden">
                <div className="aspect-video relative">
                  <img
                    src={building.image}
                    alt={building.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{building.name}</CardTitle>
                  <CardDescription>{building.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2" />
                      {building.location}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <DollarSign className="h-4 w-4 mr-2" />
                      ${building.pricePerDay} per day
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full"
                    onClick={() => setSelectedBuilding(building)}
                  >
                    Book Now
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="sticky top-6">
            <Card>
              <CardHeader>
                <CardTitle>Select Booking Date</CardTitle>
                <CardDescription>
                  Choose your preferred date for the venue
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </CardContent>
              {selectedBuilding && selectedDate && (
                <CardFooter>
                  <div className="w-full space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>Selected Date:</span>
                      <span>{format(selectedDate, 'PPP')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Venue:</span>
                      <span>{selectedBuilding.name}</span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold">
                      <span>Total Price:</span>
                      <span>${selectedBuilding.pricePerDay}</span>
                    </div>
                    <Button 
                      className="w-full"
                      onClick={() => handleBooking(selectedBuilding)}
                    >
                      Confirm Booking
                    </Button>
                  </div>
                </CardFooter>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}