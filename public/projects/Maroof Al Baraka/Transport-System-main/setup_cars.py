import os
import shutil
import glob

source_dir = r'c:\Users\Ranaa Ali Haider\Desktop\Transport System\Car IMAGES'
dest_dir = r'c:\Users\Ranaa Ali Haider\Desktop\Transport System\public\images\landing_cars'

os.makedirs(dest_dir, exist_ok=True)

# Clear old images
for f in glob.glob(os.path.join(dest_dir, '*')):
    os.remove(f)

# Get source images
images = glob.glob(os.path.join(source_dir, '*.jpeg')) + glob.glob(os.path.join(source_dir, '*.jpg'))
images.sort()

image_paths = []
for idx, img in enumerate(images):
    ext = os.path.splitext(img)[1]
    new_name = f'car_{idx+1}{ext}'
    dest_path = os.path.join(dest_dir, new_name)
    shutil.copy2(img, dest_path)
    image_paths.append(f'images/landing_cars/{new_name}')
    print(f'Copied to {dest_path}')

# Now generate a PHP script for Tinker
php_script = """
App\\Models\\LandingCar::truncate();

$cars = [
    ['route' => 'JED → MAK · ECONOMY', 'name' => 'Toyota Camry', 'subtitle' => 'Seats 4 · individuals & small families', 'label' => 'Standard', 'image_path' => '{img0}', 'sort_order' => 1],
    ['route' => 'JED → MAD · FAMILY', 'name' => 'Hyundai Staria', 'subtitle' => 'Seats 7 · comfort for families', 'label' => 'Popular', 'image_path' => '{img1}', 'sort_order' => 2],
    ['route' => 'MAK → MAD · PREMIUM', 'name' => 'GMC Yukon', 'subtitle' => 'Seats 7 · premium SUV experience', 'label' => 'VIP', 'image_path' => '{img2}', 'sort_order' => 3],
    ['route' => 'JED → MAK · LUXURY', 'name' => 'Ford Taurus', 'subtitle' => 'Seats 4 · luxury sedan', 'label' => 'Luxury', 'image_path' => '{img3}', 'sort_order' => 4],
    ['route' => 'JED → MAD · GROUP', 'name' => 'Toyota HiAce', 'subtitle' => 'Seats 12 · large groups & luggage', 'label' => 'Spacious', 'image_path' => '{img4}', 'sort_order' => 5],
];

foreach ($cars as $car) {
    App\\Models\\LandingCar::create($car);
}
echo "Database updated.";
"""

php_script = php_script.replace('{img0}', image_paths[0] if len(image_paths) > 0 else '')
php_script = php_script.replace('{img1}', image_paths[1] if len(image_paths) > 1 else image_paths[0] if len(image_paths)>0 else '')
php_script = php_script.replace('{img2}', image_paths[2] if len(image_paths) > 2 else image_paths[0] if len(image_paths)>0 else '')
php_script = php_script.replace('{img3}', image_paths[3] if len(image_paths) > 3 else image_paths[0] if len(image_paths)>0 else '')
php_script = php_script.replace('{img4}', image_paths[4] if len(image_paths) > 4 else image_paths[0] if len(image_paths)>0 else '')

with open(r'c:\Users\Ranaa Ali Haider\Desktop\Transport System\update_db.php', 'w', encoding='utf-8') as f:
    f.write(php_script)
