<?php

use Illuminate\Database\Seeder;

use App\Level;

class LevelTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Level::getQuery()->delete();

        $levels = array(
                                ['name' => 'JHS 1'],
                                ['name' => 'JHS 2'],
                                ['name' => 'JHS 3'],
                                ['name' => 'Primary 1'],
                                ['name' => 'Primary 2'],
                                ['name' => 'Primary 3'],
                                ['name' => 'Primary 4'],
                                ['name' => 'Primary 5'],
                                ['name' => 'Primary 5']
                            );
            
        // Loop through each levels above and create the record for them in the database
        foreach ($levels as $level)
        {
            Level::create($level);
        }
    }
}
