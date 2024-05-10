import { IEvents } from './pEvents';

export abstract class ViewComponent <T> {
	protected constructor(protected container: HTMLElement, protected events: IEvents) {
	}

	render(obj: Partial<T>): HTMLElement {
		Object.assign(this, obj);
		return this.container;
	}
}
