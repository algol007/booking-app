"use client";

import { useState } from "react";
import {
  getAllBookings,
  getAllBuildings,
  getAllUsers,
  updateBookingStatus,
  createUser,
  updateUser,
  deleteUser,
  createBuilding,
  updateBuilding,
  deleteBuilding,
  getMonthlyBookingSummary,
} from "@/lib/dummy-data";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import {
  Building2,
  Calendar,
  Users,
  Settings,
  Plus,
  Pencil,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<"approve" | "reject">(
    "approve"
  );
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [showBuildingDialog, setShowBuildingDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editingBuilding, setEditingBuilding] = useState<any>(null);
  const [userForm, setUserForm] = useState<{
    email: string;
    phone: string;
    role: "client" | "admin";
  }>({
    email: "",
    phone: "",
    role: "client",
  });
  const [buildingForm, setBuildingForm] = useState({
    name: "",
    description: "",
    location: "",
    pricePerDay: "",
    image: "",
  });

  const { toast } = useToast();
  const bookings = getAllBookings();
  const buildings = getAllBuildings();
  const users = getAllUsers();
  const monthlySummary = getMonthlyBookingSummary();

  const handleStatusUpdate = (
    bookingId: string,
    newStatus: "approved" | "rejected"
  ) => {
    updateBookingStatus(bookingId, newStatus);
    setShowConfirmDialog(false);
    toast({
      title: `Booking ${newStatus}`,
      description: `The booking has been ${newStatus}`,
    });
  };

  const handleUserSubmit = () => {
    if (editingUser) {
      updateUser(editingUser.id, userForm);
      toast({
        title: "User Updated",
        description: "User information has been updated successfully",
      });
    } else {
      createUser(userForm);
      toast({
        title: "User Created",
        description: "New user has been created successfully",
      });
    }
    setShowUserDialog(false);
    setEditingUser(null);
    setUserForm({ email: "", phone: "", role: "client" });
  };

  const handleBuildingSubmit = () => {
    if (editingBuilding) {
      updateBuilding(editingBuilding.id, {
        ...buildingForm,
        pricePerDay: Number(buildingForm.pricePerDay),
      });
      toast({
        title: "Building Updated",
        description: "Building information has been updated successfully",
      });
    } else {
      createBuilding({
        ...buildingForm,
        pricePerDay: Number(buildingForm.pricePerDay),
      });
      toast({
        title: "Building Created",
        description: "New building has been created successfully",
      });
    }
    setShowBuildingDialog(false);
    setEditingBuilding(null);
    setBuildingForm({
      name: "",
      description: "",
      location: "",
      pricePerDay: "",
      image: "",
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
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger
              value="dashboard"
              className="flex items-center space-x-2"
            >
              <Settings className="h-4 w-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger
              value="bookings"
              className="flex items-center space-x-2"
            >
              <Calendar className="h-4 w-4" />
              <span>Bookings</span>
            </TabsTrigger>
            <TabsTrigger
              value="buildings"
              className="flex items-center space-x-2"
            >
              <Building2 className="h-4 w-4" />
              <span>Buildings</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Users</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Bookings</CardTitle>
                  <CardDescription>
                    Number of bookings per month
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlySummary}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="total"
                        stroke="#8884d8"
                        name="Total Bookings"
                      />
                      <Line
                        type="monotone"
                        dataKey="approved"
                        stroke="#82ca9d"
                        name="Approved"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Monthly Revenue</CardTitle>
                  <CardDescription>
                    Revenue from approved bookings
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlySummary}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="revenue"
                        fill="#8884d8"
                        name="Revenue ($)"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Booking Requests</CardTitle>
                <CardDescription>
                  Manage all venue booking requests
                </CardDescription>
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
                      const building = buildings.find(
                        (b) => b.id === booking.buildingId
                      );
                      return (
                        <TableRow key={booking.id}>
                          <TableCell>{building?.name}</TableCell>
                          <TableCell>
                            {format(new Date(booking.startDate), "PPP")}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                              ${
                                booking.status === "approved"
                                  ? "bg-green-100 text-green-800"
                                  : booking.status === "rejected"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {booking.status}
                            </span>
                          </TableCell>
                          <TableCell>${booking.totalPrice}</TableCell>
                          <TableCell>
                            {booking.status === "pending" && (
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    setSelectedBooking(booking);
                                    setConfirmAction("approve");
                                    setShowConfirmDialog(true);
                                  }}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => {
                                    setSelectedBooking(booking);
                                    setConfirmAction("reject");
                                    setShowConfirmDialog(true);
                                  }}
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
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Building Management</CardTitle>
                  <CardDescription>
                    Manage venue details and pricing
                  </CardDescription>
                </div>
                <Button
                  onClick={() => {
                    setEditingBuilding(null);
                    setBuildingForm({
                      name: "",
                      description: "",
                      location: "",
                      pricePerDay: "",
                      image: "",
                    });
                    setShowBuildingDialog(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Building
                </Button>
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
                        <CardDescription>
                          {building.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div>Location: {building.location}</div>
                          <div>Price per day: ${building.pricePerDay}</div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingBuilding(building);
                            setBuildingForm({
                              name: building.name,
                              description: building.description,
                              location: building.location,
                              pricePerDay: building.pricePerDay.toString(),
                              image: building.image,
                            });
                            setShowBuildingDialog(true);
                          }}
                        >
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            if (
                              confirm(
                                "Are you sure you want to delete this building?"
                              )
                            ) {
                              deleteBuilding(building.id);
                              toast({
                                title: "Building Deleted",
                                description:
                                  "The building has been deleted successfully",
                              });
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>
                    Manage user accounts and roles
                  </CardDescription>
                </div>
                <Button
                  onClick={() => {
                    setEditingUser(null);
                    setUserForm({ email: "", phone: "", role: "client" });
                    setShowUserDialog(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.phone}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${
                              user.role === "admin"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {user.role}
                          </span>
                        </TableCell>
                        <TableCell>
                          {format(new Date(user.createdAt), "PPP")}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingUser(user);
                                setUserForm({
                                  email: user.email,
                                  phone: user.phone,
                                  role: user.role,
                                });
                                setShowUserDialog(true);
                              }}
                            >
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                if (
                                  confirm(
                                    "Are you sure you want to delete this user?"
                                  )
                                ) {
                                  deleteUser(user.id);
                                  toast({
                                    title: "User Deleted",
                                    description:
                                      "The user has been deleted successfully",
                                  });
                                }
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Confirmation Dialog for Booking Actions */}
        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Confirm {confirmAction === "approve" ? "Approval" : "Rejection"}
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to {confirmAction} this booking?
                {confirmAction === "reject" && " This action cannot be undone."}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowConfirmDialog(false)}
              >
                Cancel
              </Button>
              <Button
                variant={
                  confirmAction === "approve" ? "default" : "destructive"
                }
                onClick={() =>
                  handleStatusUpdate(
                    selectedBooking.id,
                    confirmAction === "approve" ? "approved" : "rejected"
                  )
                }
              >
                {confirmAction === "approve" ? "Approve" : "Reject"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* User Form Dialog */}
        <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingUser ? "Edit User" : "Add New User"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={userForm.email}
                  onChange={(e) =>
                    setUserForm({ ...userForm, email: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={userForm.phone}
                  onChange={(e) =>
                    setUserForm({ ...userForm, phone: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <select
                  id="role"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  value={userForm.role}
                  onChange={(e) =>
                    setUserForm({
                      ...userForm,
                      role: e.target.value as "admin" | "client",
                    })
                  }
                >
                  <option value="client">Client</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowUserDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleUserSubmit}>
                {editingUser ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Building Form Dialog */}
        <Dialog open={showBuildingDialog} onOpenChange={setShowBuildingDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingBuilding ? "Edit Building" : "Add New Building"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={buildingForm.name}
                  onChange={(e) =>
                    setBuildingForm({ ...buildingForm, name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={buildingForm.description}
                  onChange={(e) =>
                    setBuildingForm({
                      ...buildingForm,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={buildingForm.location}
                  onChange={(e) =>
                    setBuildingForm({
                      ...buildingForm,
                      location: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="pricePerDay">Price per Day</Label>
                <Input
                  id="pricePerDay"
                  type="number"
                  value={buildingForm.pricePerDay}
                  onChange={(e) =>
                    setBuildingForm({
                      ...buildingForm,
                      pricePerDay: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  value={buildingForm.image}
                  onChange={(e) =>
                    setBuildingForm({ ...buildingForm, image: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowBuildingDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleBuildingSubmit}>
                {editingBuilding ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
