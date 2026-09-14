<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Vendor;
use App\Models\Route;
use App\Models\Driver;
use App\Models\Vehicle;
use App\Models\Booking;
use App\Models\Passenger;
use App\Models\Trip;
use App\Models\Income;
use App\Models\Expense;
use App\Models\DriverPayment;
use Carbon\Carbon;

class SampleDataSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Vendors
        $vendor1 = Vendor::create([
            'company_name' => 'Al Haram Travels',
            'contact_person' => 'Mohammed Ali',
            'phone' => '+966 50 123 4567',
            'email' => 'contact@alharam.com',
            'status' => 'Active'
        ]);
        
        $vendor2 = Vendor::create([
            'company_name' => 'Makkah VIP Logistics',
            'contact_person' => 'Tariq Saeed',
            'phone' => '+966 55 987 6543',
            'email' => 'vip@makkahlogistics.com',
            'status' => 'Active'
        ]);

        // 2. Routes
        $route1 = Route::create([
            'route_name' => 'JED to Makkah Hotel',
            'from_location' => 'Jeddah Airport (JED)',
            'to_location' => 'Clock Tower Makkah',
            'distance' => 100.5,
            'est_time' => '1h 30m',
            'default_price' => 250.00,
            'status' => 'Active'
        ]);
        
        $route2 = Route::create([
            'route_name' => 'Makkah to Madinah',
            'from_location' => 'Makkah Hotel',
            'to_location' => 'Masjid al-Nabawi',
            'distance' => 450.0,
            'est_time' => '4h 45m',
            'default_price' => 1200.00,
            'status' => 'Active'
        ]);

        // 3. Drivers
        $driver1 = Driver::create([
            'name' => 'Ahmed Hassan',
            'license_number' => 'DL-998822',
            'phone' => '0501112222',
            'status' => 'Available'
        ]);
        
        $driver2 = Driver::create([
            'name' => 'Omar Farooq',
            'license_number' => 'DL-443311',
            'phone' => '0553334444',
            'status' => 'On Trip'
        ]);

        // 4. Vehicles
        $vehicle1 = Vehicle::create([
            'plate_number' => 'ABC 1234',
            'model' => 'GMC Yukon 2023',
            'capacity' => 7,
            'status' => 'Available'
        ]);
        
        $vehicle2 = Vehicle::create([
            'plate_number' => 'XYZ 9876',
            'model' => 'Toyota Hiace 2022',
            'capacity' => 14,
            'status' => 'On Trip'
        ]);

        // 5. Bookings
        $booking1 = Booking::create([
            'date' => Carbon::today(),
            'vendor_id' => $vendor1->id,
            'route_id' => $route1->id,
            'group_name' => 'Hajji Express Group A',
            'pax_count' => 12,
            'price' => 450.00,
            'status' => 'Confirmed'
        ]);

        $booking2 = Booking::create([
            'date' => Carbon::tomorrow(),
            'vendor_id' => $vendor2->id,
            'route_id' => $route2->id,
            'group_name' => 'VIP Family - Smith',
            'pax_count' => 4,
            'price' => 1500.00,
            'status' => 'Pending'
        ]);

        // 6. Passengers
        Passenger::create([
            'booking_id' => $booking1->id,
            'name' => 'Khalid Bin Waleed',
            'passport' => 'A9988776',
            'nationality' => 'Indonesian',
            'phone' => '+62 812 345 678'
        ]);
        Passenger::create([
            'booking_id' => $booking1->id,
            'name' => 'Fatima Zahra',
            'passport' => 'A9988777',
            'nationality' => 'Indonesian',
            'phone' => '+62 812 345 679'
        ]);
        Passenger::create([
            'booking_id' => $booking2->id,
            'name' => 'John Smith',
            'passport' => 'US1234567',
            'nationality' => 'American',
            'phone' => '+1 555 123 4567'
        ]);

        // 7. Trips
        $trip1 = Trip::create([
            'date' => Carbon::today(),
            'booking_id' => $booking1->id,
            'driver_id' => $driver1->id,
            'vehicle_id' => $vehicle2->id,
            'status' => 'In Progress',
            'details' => 'Picked up from airport.'
        ]);

        $trip2 = Trip::create([
            'date' => Carbon::tomorrow(),
            'booking_id' => $booking2->id,
            'driver_id' => $driver2->id,
            'vehicle_id' => $vehicle1->id,
            'status' => 'Scheduled',
            'details' => 'Wait at terminal 1.'
        ]);

        // 8. Incomes
        Income::create([
            'date' => Carbon::today(),
            'source' => 'Booking Advance',
            'amount' => 250.00,
            'method' => 'Bank Transfer',
            'vendor_id' => $vendor1->id,
            'details' => '50% advance for Hajji Express'
        ]);
        Income::create([
            'date' => Carbon::today()->subDays(2),
            'source' => 'Full Payment',
            'amount' => 1200.00,
            'method' => 'Cash',
            'vendor_id' => $vendor2->id,
            'details' => 'Paid in full upon arrival'
        ]);

        // 9. Expenses
        Expense::create([
            'date' => Carbon::today(),
            'category' => 'Fuel',
            'amount' => 120.00,
            'paid_by' => 'Company Card',
            'driver_id' => $driver1->id,
            'vehicle_id' => $vehicle2->id,
            'details' => 'Full tank at Jeddah station'
        ]);
        Expense::create([
            'date' => Carbon::yesterday(),
            'category' => 'Maintenance',
            'amount' => 500.00,
            'paid_by' => 'Cash',
            'driver_id' => null,
            'vehicle_id' => $vehicle1->id,
            'details' => 'Oil change and tire rotation'
        ]);

        // 10. Driver Payments
        DriverPayment::create([
            'date' => Carbon::today(),
            'driver_id' => $driver1->id,
            'type' => 'Advance',
            'amount' => 200.00,
            'method' => 'Cash',
            'details' => 'Weekly allowance'
        ]);
        DriverPayment::create([
            'date' => Carbon::yesterday(),
            'driver_id' => $driver2->id,
            'type' => 'Salary',
            'amount' => 3000.00,
            'method' => 'Bank Transfer',
            'details' => 'Base salary for previous month'
        ]);
    }
}
