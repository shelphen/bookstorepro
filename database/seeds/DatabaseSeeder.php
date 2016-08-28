<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
         $this->call(UserTableSeeder::class);
         $this->command->info('User seeds finished.');

         $this->call(SupplierTableSeeder::class);
         $this->command->info('Supplier seeds finished.');

         $this->call(LevelTableSeeder::class);
         $this->command->info('Level seeds finished.');
         
         $this->call(CategoryTableSeeder::class);
         $this->command->info('Category seeds finished.');
    }
}
