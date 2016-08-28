

export interface BookInterface {
    
    title: string;

    description: string;

    category_id: number;

    level_id: number;

    author: string;

    price: number;

    sales_price: number;

    batch: string;

    supplier_id: number;

    image: any;

    quantity_method: {
                        type: string; //must be either 'box' or 'stock'
                        box: {
                                number_of_boxes: number;
                                quantity: number;
                        },
                        stock: {
                                quantity: number;
                        }
                    }
}