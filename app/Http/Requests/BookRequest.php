<?php

namespace App\Http\Requests;

use App\Http\Requests\Request;

class BookRequest extends Request
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
                    'category_id' => 'required',
                    'level_id'  => 'required',
                    'supplier_id' => 'required',
                    'title' => 'required',
                    'author' => '',
                    'batch' => '',
                    'price' => 'required',
                    'sales_price' => 'required',
                    'quantity_type' => 'required',
                    'number_of_boxes' => '',
                    'quantity' => 'required',
                    'description' => '',
                    'image' => ''
                ];
    }
}
