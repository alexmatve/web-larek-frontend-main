import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";




interface ISuccess {
    total: number;
}

interface ISuccessActions {
    onClick: () => void;
}

export class Success extends Component<ISuccess> {
    public descriptionEl: HTMLElement;
    public buttonEl: HTMLButtonElement;

    constructor(container: HTMLElement, actions: ISuccessActions) {
        super(container);

        this.descriptionEl = ensureElement<HTMLElement>('.order-success__description', this.container);
        this.buttonEl = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

        if (actions?.onClick) {
            this.buttonEl.addEventListener('click', actions.onClick);
        }
    }

    set total(value:number) {
        this.setText(this.descriptionEl, `Списано ${value} синапсов`);
    }
}