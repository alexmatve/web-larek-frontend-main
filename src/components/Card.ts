import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { CDN_URL } from "../utils/constants";
import { Price } from "../types/controller";
import { AppState } from "./AppData";


interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export interface ICard<T> {
    title: string;
    image: string;
    price: string;
    category: string;
    description: string;
}

export class Card<T> extends Component<ICard<T>> {
    titleEl: HTMLElement;
    imageEl: HTMLImageElement;
    priceEl: HTMLElement;
    categoryEl: HTMLElement;
    

    constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions){
        super(container);

        
        this.categoryEl = ensureElement<HTMLElement>(`.${blockName}__category`, container)
        this.titleEl = ensureElement<HTMLElement>(`.${blockName}__title`, container);
        this.imageEl = ensureElement<HTMLImageElement>(`.${blockName}__image`, container);
        this.priceEl = ensureElement<HTMLElement>(`.${blockName}__price`, container);

    }

    setColorCategory(value: string) {
        if (this.categoryEl.classList.contains('card__category_soft')) {
            this.categoryEl.classList.remove('card__category_soft');
        }

        if (value === 'софт-скил') {
            this.categoryEl.classList.add('card__category_soft');
        } else if (value === 'другое') {
            this.categoryEl.classList.add('card__category_other');
        } else if (value === 'дополнительное') {
            this.categoryEl.classList.add('card__category_additional');
        } else if (value === 'кнопка') {
            this.categoryEl.classList.add('card__category_button');
        } else if (value === 'хард-скил') {
            this.categoryEl.classList.add('card__category_hard');
        }
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }

    get id(): string {
        return this.container.dataset.id || '';
    }

    set category(value: string) {
        this.setText(this.categoryEl, value);
    }

    get category(): string {
        return this.categoryEl.textContent || '';
    }

    set title(value: string) {
        this.setText(this.titleEl, value);
    }

    get title(): string {
        return this.titleEl.textContent || '';
    }

    set image(value: string) {
        // const imgSrc = require(`../images${value}`).default;
        this.setImage(this.imageEl, CDN_URL + value, this.title);
    }

    set price(value: string) {
        this.setText(this.priceEl, value === null ? "Бесценно" : value + " синапсов");
    }

    get price(): string {
        return this.priceEl.textContent;
    }
}

export type CatalogItemStatus = {
    status: string;
    label: string;
}

export class CatalogItem extends Card<CatalogItemStatus> {
    
    constructor(container: HTMLElement, actions?: ICardActions) {
        super('card', container, actions);
        if (actions?.onClick) {
            container.addEventListener('click', actions.onClick); 
        }
    }
}

interface IPreviewItemActions {
    onSubmit: () => void;
}

export class PreviewItem<T> extends Card<ICard<T>> {
    descriptionEl: HTMLElement;
    buttonEl: HTMLButtonElement;
    constructor(container: HTMLElement, actions?: IPreviewItemActions){
        super('card', container);
    
        this.descriptionEl = ensureElement<HTMLElement>('.card__text', container);
        this.buttonEl = ensureElement<HTMLButtonElement>('.card__button', container);
        
        if (actions?.onSubmit) {
            if (this.buttonEl) {
                this.buttonEl.addEventListener('click', actions.onSubmit);
            } else {
                container.addEventListener('click', actions.onSubmit);
            }
        }

    }

    set description(value: string) {
        this.setText(this.descriptionEl, value);
    }

    get description(): string {
        return this.descriptionEl.textContent || '';
    }
}


export interface CardBasketStatus {
    status:boolean;
}

export interface ICardBasket {
    index: number;
    title: string;
    price: Price;
}


export class CardBasket extends Component<ICardBasket> {
    indexEl: HTMLElement;
    titleEl: HTMLElement;
    priceEl: HTMLElement;
    deleteButtonEl: HTMLButtonElement;
    
    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);
        
        this.indexEl = ensureElement<HTMLElement>('.basket__item-index', container);
        this.titleEl = ensureElement<HTMLElement>(`.card__title`, container);
        this.priceEl = ensureElement<HTMLElement>(`.card__price`, container);
        this.deleteButtonEl = ensureElement<HTMLButtonElement>('.card__button', container);
        if (actions?.onClick) {
            if (this.deleteButtonEl) {
                this.deleteButtonEl.addEventListener('click', (event: MouseEvent) => {
                    actions.onClick?.(event);
                });
            }
        }
    }

    set index(value: string) {
        this.setText(this.indexEl, value);
    }

    get index(): string {
        return this.indexEl.textContent || '';
    }

    set title(value: string) {
        this.setText(this.titleEl, value);
    }

    get title(): string {
        return this.titleEl.textContent || '';
    }

    set price(value: string) {
        this.setText(this.priceEl, value === null ? "Бесценно" : value + " синапсов");
    }

    get price(): string {
        return this.priceEl.textContent;
    }
}
