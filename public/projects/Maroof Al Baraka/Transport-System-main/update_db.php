<?php
App\Models\LandingCar::truncate();

$cars = [
    ['route' => 'JED → MAK · ECONOMY', 'name' => 'Toyota Camry', 'subtitle' => 'Seats 4 · individuals & small families', 'label' => 'Standard', 'image_path' => 'images/landing_cars/car_1.jpeg', 'sort_order' => 1],
    ['route' => 'JED → MAD · FAMILY', 'name' => 'Hyundai Staria', 'subtitle' => 'Seats 7 · comfort for families', 'label' => 'Popular', 'image_path' => 'images/landing_cars/car_2.jpeg', 'sort_order' => 2],
    ['route' => 'MAK → MAD · PREMIUM', 'name' => 'GMC Yukon', 'subtitle' => 'Seats 7 · premium SUV experience', 'label' => 'VIP', 'image_path' => 'images/landing_cars/car_3.jpeg', 'sort_order' => 3],
    ['route' => 'JED → MAK · LUXURY', 'name' => 'Ford Taurus', 'subtitle' => 'Seats 4 · luxury sedan', 'label' => 'Luxury', 'image_path' => 'images/landing_cars/car_4.jpeg', 'sort_order' => 4],
    ['route' => 'JED → MAD · GROUP', 'name' => 'Toyota HiAce', 'subtitle' => 'Seats 12 · large groups & luggage', 'label' => 'Spacious', 'image_path' => 'images/landing_cars/car_5.jpeg', 'sort_order' => 5],
];

foreach ($cars as $car) {
    App\Models\LandingCar::create($car);
}
echo "Database updated.";
