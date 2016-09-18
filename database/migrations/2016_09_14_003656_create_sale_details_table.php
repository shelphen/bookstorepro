<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSaleDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sale_details', function(Blueprint $table){
            
            $table->increments('id')->unsigned();
            $table->integer('sale_id')->unsigned();
            $table->foreign('sale_id','sale_details_saleId_fk')
                ->references('id')
                ->on('sales')
                ->onDelete('cascade')
                ->onUpdate('cascade');
            $table->integer('book_id')->unsigned();
            $table->foreign('book_id','sale_details_bookId_fk')
                ->references('id')
                ->on('books')
                ->onDelete('cascade')
                ->onUpdate('cascade');
            $table->integer('quantity')->default(0);
            $table->decimal('cost')->default(0.00);
            $table->timestamps();
            
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('sale_details');
    }
}
