import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Building2 } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center space-y-8 text-center">
          <div className="flex items-center space-x-2">
            <Building2 className="h-12 w-12" />
            <h1 className="text-4xl font-bold">Building Booking System</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-[600px]">
            Book your perfect venue for any occasion. Simple, fast, and reliable.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-[800px]">
            <Card>
              <CardHeader>
                <CardTitle>Client Portal</CardTitle>
                <CardDescription>Book venues and manage your reservations</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Access our client portal to:</p>
                <ul className="list-disc list-inside mt-2 text-muted-foreground">
                  <li>View available venues</li>
                  <li>Make bookings</li>
                  <li>Manage your reservations</li>
                  <li>Upload payment proof</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/client" className="w-full">
                  <Button className="w-full">Enter Client Portal</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Admin Dashboard</CardTitle>
                <CardDescription>Manage bookings and venue settings</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Access the admin dashboard to:</p>
                <ul className="list-disc list-inside mt-2 text-muted-foreground">
                  <li>Review booking requests</li>
                  <li>Manage venues</li>
                  <li>Set pricing</li>
                  <li>Handle user management</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/admin" className="w-full">
                  <Button className="w-full" variant="secondary">Enter Admin Dashboard</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}