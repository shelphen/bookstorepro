<?php

use Illuminate\Database\Seeder;

use App\Category;

class CategoryTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Category::getQuery()->delete();

        $categories = array(
                ['name' => 'Science'],
                ['name' => 'Social Studies'],
                ['name' => 'Languages'],
                ['name' => 'Maths']
        );
            
        // Loop through each category above and create the record for them in the database
        foreach ($categories as $category)
        {
            Category::create($category);
        }
    }
}
