<?php

use Illuminate\Database\Seeder;

use App\Supplier;

class SupplierTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Supplier::getQuery()->delete();

        $suppliers = array(
                                ['name' => 'Epp', 'contact' => '0234575857', 'location' => 'Accra'],
                                ['name' => 'Kingdom', 'contact' => '0324585744', 'location' => 'Tema']
                            );
            
        // Loop through each levels above and create the record for them in the database
        foreach ($suppliers as $supplier)
        {
            Supplier::create($supplier);
        }
    }
}
