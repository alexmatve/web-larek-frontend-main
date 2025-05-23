import { Id, Category, Title, Price, Image, Description, payment, Address, Email, phone } from "./controller";
import { IProduct } from "./models";

//---------------------------VIEW-------------------------

// Повторяющиеся части настроек, например обработчики кликов или изменений,
// лучше выделять в отдельные интерфейсы, такая универсальность поможет
// переиспользовать типы и делать меньше ошибок
export type IClickableEvent<T> = {event: MouseEvent, item: T};
export interface IClickable<T> {
    onClick (args: IClickableEvent<T>): void;
}


export interface IPageView {
    catalog: HTMLElement[];
    buttonText?: string;
}

// Интерфейс попапа
export interface IPopupView {
    content: HTMLElement;
}

export interface IProductView extends IProduct {
}

export interface IBasketView {
    products: HTMLElement[];
    total: number;
    buttonText?: string;
}

export interface IOrderView {
    payment: payment;
    address: Address; 
}

export interface IContactsView {
    email: Email; 
    phone: phone; 
}

export interface IOrderData extends IOrderView, IContactsView {}

export type FormErrors = Partial<Record<keyof IOrderData, string>>;


export interface IOrderResult {
    total: number;
    id?: number;
}