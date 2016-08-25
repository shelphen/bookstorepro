

export interface BookInterface {
    
    title: string;

    description: string;

    category_id: number;

    level_id: number;

    author: string;

    price: number;

    sales_price: number;

    batch: string;

    supplier_name: string;

    supplier_location: string;

    supplier_contact: string;

    image: any;

    quantity_method: {
        type: string; //must be either 'box' or 'stock'
        box: {
                number_of_boxes: number;
                quantity_in_box: number;
        },
        stock: {
                quantity: number;
        }
    }
}