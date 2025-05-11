import { Id, Category, Title, Price, Image, Description, payment, Address, Email, phone, Status } from "./controller";

//---------------------------MODELS-------------------------
// Интерфейс товара
export interface IProduct {
    id: Id;
    category: Category;
    title: Title;
    price: Price;
    image: Image;
    description: Description;
    
}

// список всех товаров
export interface IProductsModel {
    products: IProduct[];
    getProduct(id: Id): IProduct | undefined;
    getAllProducts(): IProduct[];
    containsProduct(id: Id): boolean;
}

// Интерфейс корзины
export interface IBasketModel extends IProductsModel{

    add(product: IProduct): void;
    remove(product: IProduct): void;
}

export interface ICustomerData { // данные о покупателе
    payment: payment;
    address: Address; 
    email: Email; 
    phone: phone; 
    total: number;
    items: Id[];
}


// 3. API для получения товаров;
export interface ILarekAPI {
    getProductsList: () => Promise<ApiListResponse<IProduct>>;
    getProduct: (id: Id) => Promise<IProductResult>;
    postProduct: (order: ICustomerData) => Promise<IProductPut>;
}



export type ApiListResponse<Type> = {
    total: number,
    items: Type[]
};

export interface IProductResult extends IProduct{ 
}

export interface IProductPut {
    id: Id;
    total: number;
}


// интерфейс API
export interface IProductListAPI {
    load(): Promise<ApiListResponse<IProduct>>;
}
export interface IProductItemAPI {
    load(id: Id): Promise<IProductResult>;
}