import { ViewComponent  } from './base/ViewComponent ';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

export class Modal extends ViewComponent <HTMLElement> {
	closeButton: HTMLButtonElement;
	innerContent: HTMLDivElement;

	constructor(protected container: HTMLElement, protected events: IEvents) {
		super(container, events);

		this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
		this.innerContent = ensureElement<HTMLDivElement>('.modal__content', container);

		this.container.addEventListener('click', this.close.bind(this));
		this.closeButton.addEventListener('click', this.close.bind(this));
		this.innerContent.addEventListener('click', (evt) => evt.stopPropagation());
	}

	close() {
		this.container.classList.remove('modal_active');
		this.events.emit('modal:close');
	}

	open() {
		this.container.classList.add('modal_active');
		this.events.emit('modal:open');
	}

	render(obj: HTMLElement): HTMLElement {
		this.innerContent.replaceChildren(obj);

		return this.container;
	}
}