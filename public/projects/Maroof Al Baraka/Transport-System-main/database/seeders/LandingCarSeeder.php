<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\LandingCar;

class LandingCarSeeder extends Seeder
{
    public function run(): void
    {
        LandingCar::create([
            'route' => 'JED → MAK · GROUP',
            'name' => 'Toyota HI Ace',
            'subtitle' => 'Seats 12 · families & medium groups',
            'label' => 'Best for groups',
            'sort_order' => 1,
        ]);

        LandingCar::create([
            'route' => 'JED → MAD · FAMILY',
            'name' => 'Hyundai Staria',
            'subtitle' => 'Seats 7 · families & small groups',
            'label' => 'Most popular',
            'sort_order' => 2,
        ]);

        LandingCar::create([
            'route' => 'JED → MAK · PREMIUM',
            'name' => 'Staria X',
            'subtitle' => 'Seats 7 · premium finish',
            'label' => 'Top comfort',
            'sort_order' => 3,
        ]);
    }
}
