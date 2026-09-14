<?php

use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Driver;
use App\Models\Passenger;

// Boot laravel
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// 1. Create Driver User
$driverUser = User::firstOrCreate(
    ['email' => 'driver@hajjtransport.com'],
    [
        'name' => 'Ahmed Hassan (Driver)',
        'password' => Hash::make('password'),
        'role' => 'driver',
        'approval_status' => 'approved'
    ]
);

// Link to first driver
$driver = Driver::first();
if ($driver) {
    $driver->user_id = $driverUser->id;
    $driver->save();
}

// 2. Create Passenger User
$passengerUser = User::firstOrCreate(
    ['email' => 'passenger@hajjtransport.com'],
    [
        'name' => 'John Smith (Passenger)',
        'password' => Hash::make('password'),
        'role' => 'passenger',
        'approval_status' => 'approved'
    ]
);

// Link to a passenger
$passenger = Passenger::where('name', 'John Smith')->first();
if ($passenger) {
    $passenger->user_id = $passengerUser->id;
    $passenger->save();
}

echo "Created test users successfully!\n";
