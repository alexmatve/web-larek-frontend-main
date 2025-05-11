import { PaymentMethod, payment } from "../types/controller";
import { IContactsView } from "../types/views";
import { IEvents } from "./base/events";
import { Form } from "./common/Form";


export interface IOrderPaymentForm {
    payment: PaymentMethod;
    address: string;
}

export class OrderPayment extends Form<IOrderPaymentForm> {
    cardButtonEl: HTMLButtonElement;
    cashButtonEl: HTMLButtonElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this.cardButtonEl = container.querySelector(`[name="card"]`)
        this.cashButtonEl = container.querySelector(`[name="cash"]`)

        this.cardButtonEl.addEventListener('click', () => {
            this.cardButtonEl.classList.toggle('button_alt-active');
            if (this.cashButtonEl.classList.contains('button_alt-active')) {
                this.cashButtonEl.classList.remove('button_alt-active')
            }
        });
        this.cashButtonEl.addEventListener('click', () => {
            this.cashButtonEl.classList.toggle('button_alt-active')
            if (this.cardButtonEl.classList.contains('button_alt-active')) {
                this.cardButtonEl.classList.remove('button_alt-active')
            }
            
        });
    }

    get payment(): payment {
        if (this.cardButtonEl.classList.contains('button_alt-active')) {
            return 'Онлайн';
        }
        return 'При получении';
    }

    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    }
}


export class OrderContacts extends Form<IContactsView> {
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
    }

    set phone(value: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
    }

    set email(value: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    }
}