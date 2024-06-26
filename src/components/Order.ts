import { ViewComponent } from './base/ViewComponent ';
import { IEvents } from './base/Events';
import { ensureElement } from '../utils/utils';
import { IBasketOrder, TOrderPayment } from '../types';


export class Order extends ViewComponent<IBasketOrder> {
	protected _payment: 'card' | 'cash';
	protected cardButtonElement: HTMLButtonElement;
	protected cashButtonElement: HTMLButtonElement;
	protected addressElement: HTMLInputElement;
	protected orderButtonElement: HTMLButtonElement;

	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container, events);

		this.cardButtonElement = this.container.elements.namedItem('card') as HTMLButtonElement;
		this.cashButtonElement = this.container.elements.namedItem('cash') as HTMLButtonElement;
		this.addressElement = this.container.elements.namedItem('address') as HTMLInputElement;
		this.orderButtonElement = ensureElement<HTMLButtonElement>('.order__button', this.container);

		this.cardButtonElement.addEventListener('click', () => this.payment = 'card');
		this.cashButtonElement.addEventListener('click', () => this.payment = 'cash');

		this.addressElement.addEventListener('input', this.updateOrderButtonState.bind(this));

		this.orderButtonElement.addEventListener('click', (evt) => {
			evt.preventDefault();
			events.emit('order:submit', { address: this.addressElement.value, payment: this.payment });
		});
	}

	protected set address(address: string) {
		this.addressElement.value = address;
		this.updateOrderButtonState();
	}

	protected set payment(payment: TOrderPayment) {
		this._payment = payment ?? 'cash';
		this.updateOrderButtonState();

		if (payment === 'card') {
			this.cardButtonElement.classList.add('button_alt-active');
			this.cashButtonElement.classList.remove('button_alt-active');
			return;
		}

		this.cardButtonElement.classList.remove('button_alt-active');
		this.cashButtonElement.classList.add('button_alt-active');
	}

	protected get payment() {
		return this._payment;
	}

	protected updateOrderButtonState(): void {
		this.orderButtonElement.disabled = !(this.addressElement.value && this.payment);
	}
}