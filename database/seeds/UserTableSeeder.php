<?php

use Illuminate\Database\Seeder;

use  App\User;

class UserTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        User::getQuery()->delete();

        $users = array(
                ['name' => 'Admin', 'email' => 'admin@admin.com', 'password' => Hash::make('secret')],
                ['name' => 'Adam', 'email' => 'adam@admin.com', 'password' => Hash::make('secret')],
                ['name' => 'Junior', 'email' => 'junior@admin.com', 'password' => Hash::make('secret')],
                ['name' => 'Bernice', 'email' => 'bernice@admin.com', 'password' => Hash::make('secret')]
        );
            
        // Loop through each user above and create the record for them in the database
        foreach ($users as $user)
        {
            User::create($user);
        }

        //Model::reguard();
    }
}
