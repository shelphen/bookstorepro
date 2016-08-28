<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateBooksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('books', function(Blueprint $table){
            
            $table->increments('id')->unsigned();
            $table->integer('category_id')->unsigned();
            $table->foreign('category_id','books_categoryId_fk')
                ->references('id')
                ->on('categories')
                ->onDelete('cascade')
                ->onUpdate('cascade');
            $table->integer('level_id')->unsigned();
            $table->foreign('level_id','books_levelId_fk')
                ->references('id')
                ->on('levels')
                ->onDelete('cascade')
                ->onUpdate('cascade');
            $table->integer('supplier_id')->unsigned();
            $table->foreign('supplier_id','books_supplierId_fk')
                ->references('id')
                ->on('suppliers')
                ->onDelete('cascade')
                ->onUpdate('cascade');
            $table->string('title')->default('');
            $table->string('author')->default('');
            $table->string('batch')->default('');
            $table->decimal('price')->default(0.00);
            $table->decimal('sales_price')->default(0.00);
            $table->string('quantity_type')->default('');
            $table->integer('number_of_boxes')->default(0);
            $table->integer('quantity')->default(0);
            $table->text('description')->default('');
            $table->string('image')->default('');
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
        Schema::drop('books');
    }
}
