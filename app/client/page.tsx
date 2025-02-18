"use client";

import { useState } from "react";
import { Building, getAllBuildings, createBooking } from "@/lib/dummy-data";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import {
  Building2,
  Calendar as CalendarIcon,
  MapPin,
  DollarSign,
  Search,
} from "lucide-react";

const ITEMS_PER_PAGE = 4;

export default function ClientPage() {
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(
    null
  );
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  const allBuildings = getAllBuildings();

  // Filter buildings based on search term
  const filteredBuildings = allBuildings.filter(
    (building) =>
      building.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      building.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      building.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredBuildings.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedBuildings = filteredBuildings.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

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
      userId: "2", // Using dummy client ID
      startDate: selectedDate,
      endDate: endDate,
      status: "pending",
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

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search venues by name, description, or location..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page when searching
              }}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            {paginatedBuildings.map((building) => (
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
                      <DollarSign className="h-4 w-4 mr-2" />$
                      {building.pricePerDay} per day
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  )
                )}
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
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
                      <span>{format(selectedDate, "PPP")}</span>
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
