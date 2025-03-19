import { Id, Category, Title, Price, Image, Description, PayMethod, Address, Email, Telephone } from "./controller";

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
    payMethod: PayMethod;
    address: Address; 
    email: Email; 
    telephone: Telephone; 
    total: number;
    items: IProduct[];
}

// 3. API для получения товаров;
export interface IListResult<T> { // объявляем дженерик, где T — любой тип
    total: number;
    items: T[];
}

export interface IProductResult extends IProduct{ 
}

// интерфейс API
export interface IProductListAPI {
    load(): Promise<IListResult<IProduct>>;
}
export interface IProductItemAPI {
    load(id: Id): Promise<IProductResult>;
}