import { createElement, ensureElement, formatNumber } from "../../utils/utils";
import { Component } from "../base/Component";
import { EventEmitter } from "../base/events";


export interface IBasketView {
    items: HTMLElement[];
    price: number;
}

export class Basket extends Component<IBasketView> {
    public listEl: HTMLElement;
    public priceEl: HTMLElement;
    public buttonEl: HTMLElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);

        this.listEl = ensureElement<HTMLElement>('.basket__list', this.container);
        this.priceEl = this.container.querySelector('.basket__price');
        this.buttonEl = this.container.querySelector('.basket__button');

        if (this.buttonEl) {
            this.buttonEl.addEventListener('click', () => {
                events.emit('order:open');
            });
        }

        this.items = [];
    }

    set items(items: HTMLElement[]) {
        if (items.length) {
            this.listEl.replaceChildren(...items);
        } else {
            const elem: HTMLParagraphElement =  createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста'
            });
            this.listEl.replaceChildren(elem);
        }
    }

    set price(price: number) {
        this.setText(this.priceEl, formatNumber(price) + " синапсов");
    }

    setIndexes() {
        this.listEl.querySelectorAll('li').forEach((li, index) => {
            const indexEl = li.querySelector('.basket__item-index');
            console.log(indexEl);
            console.log(index);
            
            indexEl.textContent = (index + 1).toString();
        })
    }

}