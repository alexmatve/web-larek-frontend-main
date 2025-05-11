import { Category, Description, Id, Image, Price, Status, Title } from "../types/controller";
import { ICustomerData, IProduct } from "../types/models";
import { FormErrors, IOrderData, IOrderView } from "../types/views";
import { ApiListResponse } from "./base/api";
import { Model } from "./base/Model";
import { IOrderPaymentForm } from "./Order";


export type CatalogChangeEvent = {
    catatlog: IProduct[]
};

export class ProductItem extends Model<IProduct> {
    id: Id;
    category: Category;
    title: Title;
    price: Price;
    image: Image;
    description: Description;
    status: Status;
    index: number;

    placeToBasket(): void {
        this.status = "inBasket";
        this.emitChanges('basket:changed', {id: this.id});
    }

    


}

export interface IAppState {
    catalog: IProduct[];
    basket: string[];
    preview: string | null;
    order: ICustomerData | null;
    loading: boolean;
}

export class AppState extends Model<IAppState> {
    basket: string[];
    catalog: ProductItem[];
    loading: boolean;
    order: ICustomerData = {
        payment: '',
        address: '',
        email: '',
        phone: '',
        total: 0,
        items: []
    }
    preview: string | null;
    formErrors: FormErrors;

    setCatalog(items: ApiListResponse<ProductItem>) {
        console.log(items);
        this.catalog = items.items.map(item => new ProductItem(item, this.events));
        this.emitChanges('items:changed', { catalog: this.catalog });
    }

    setPreview(item: ProductItem) {
        this.preview = item.id;
        this.emitChanges('preview:changed', item);
    }

    getBoughtItems(): ProductItem[] {
        return this.catalog
            .filter(item => item.status === 'inBasket');
    }

    getIndex(id: Id): number {
        return this.getBoughtItems().findIndex(item => item.id === id) + 1;

    }


    getTotal() {
        let total = 0;
        const items = this.getBoughtItems();
        for (const item of items) {
            if (item.price === 'Бесценно') {
                continue;
            } 
            total += Number(item.price);
        }
        return total;
    }

    deleteFromBasket(id: string) {
        const items = this.getBoughtItems();
        for (const item of items) {
            if (item.id === id) {
                item.status = 'inStock';
            } 
        }
    }

    getIndexBasket(): number {
        const index = this.getBoughtItems().length + 1;
        return index;
    }

    setOrderItems() {
        this.order.items = [];
        const boughtItems = this.getBoughtItems();
        for (const item of boughtItems) {
            this.order.items.push(item.id);
        }
    }

    clearBasket() {
        const items = this.getBoughtItems();
        for (const item of items) {  
            item.status = 'inStock';       
        }
    }

    

    setOrderField(field: keyof IOrderData, value: string) {
        this.order[field] = value;
        console.log(field);

        if (field === "address" as keyof IOrderData){
            if (this.validatePaymentOrder()) {
                this.events.emit('order-payment:ready', this.order);
            } 
        } else {
            if (this.validateContactsOrder()) {
                this.events.emit('order-contacts:ready', this.order);
            }
        }

    }

    validatePaymentOrder() {
        const errors: typeof this.formErrors = {};
        
        if (!this.order.address) {
            errors.address = 'Необходимо указать адрес'
        }
        
        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }

    validateContactsOrder() {
        const errors: typeof this.formErrors = {};
        if (!this.order.email) {
            errors.email = 'Необходимо указать email';
        }
        if (!this.order.phone) {
            errors.phone = 'Необходимо указать телефон';
        }
        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }

    

}