import './scss/styles.scss';
import { Page } from './components/Page';
import { Order } from './components/Order';
import { Modal } from './components/Modal';
import { Basket } from './components/Basket';
import { Card } from './components/CardModel';
import { ShopApi } from './components/ShopApi';
import { Storage } from './components/AppData';
import { Contacts } from './components/Contacts';
import { Success } from './components/SuccessOrder';
import { CDN_URL, API_URL } from './utils/constants';
import { EventEmitter } from './components/base/Events';
import { cloneTemplate, ensureElement } from './utils/utils';
import { IProduct, IBasketContacts, IBasketOrder } from './types';

const events = new EventEmitter();
const rootElement = ensureElement<HTMLDivElement>('.page');
const basketTemplate = ensureElement<HTMLTemplateElement>(
	'#basket',
	rootElement
);
const modalElement = ensureElement<HTMLDivElement>(
	'#modal-container',
	rootElement
);
const successTemplate = ensureElement<HTMLTemplateElement>(
	'#success',
	rootElement
);
const basketOrderTemplate = ensureElement<HTMLTemplateElement>(
	'#order',
	rootElement
);
const basketCardTemplate = ensureElement<HTMLTemplateElement>(
	'#card-basket',
	rootElement
);
const basketContactsTemplate = ensureElement<HTMLTemplateElement>(
	'#contacts',
	rootElement
);
const previewCardTemplate = ensureElement<HTMLTemplateElement>(
	'#card-preview',
	rootElement
);
const productCardTemplate = ensureElement<HTMLTemplateElement>(
	'#card-catalog',
	rootElement
);

const api = new ShopApi(CDN_URL, API_URL);
const storage: Storage = new Storage(events);
const page: Page = new Page(rootElement, events);
const modal: Modal = new Modal(modalElement, events);

const basketElement = new Basket(basketTemplate, events);
const orderElement = new Order(cloneTemplate(basketOrderTemplate), events);
const successElement = new Success(successTemplate, events);
const contactsElement = new Contacts(
	cloneTemplate(basketContactsTemplate),
	events
);

api
	.getAllProducts()
	.then((data) => {
		storage.products = data;
	})
	.catch((error) => {
		console.error('Error:', error);
	});

function renderCards(products: IProduct[]) {
	page.productCards = products.map((product) =>
		new Card(productCardTemplate, events, {
			onClick: () => events.emit('preview:selected', product),
		}).render({
			id: product.id,
			category: product.category,
			title: product.title,
			image: product.image,
			price: product.price,
		})
	);
}

function renderPreview(product: IProduct) {
	modal.render(
		new Card(previewCardTemplate, events, {
			onClick: () => events.emit('preview:submit', product),
		}).render({
			id: product.id,
			category: product.category,
			title: product.title,
			image: product.image,
			price: product.price,
			description: product.description,
			basketState: storage.basketState(product.id),
		})
	);
}

function renderBasket() {
	modal.render(
		basketElement.render({
			price: storage.getBasketTotalPrice(),
			cards: storage
				.getProductsInBasket()
				.map((product: IProduct, index: number) =>
					new Card(basketCardTemplate, events, {
						onClick: () => events.emit('basket:remove', product),
					}).render({
						id: product.id,
						title: product.title,
						price: product.price,
						index: index + 1,
					})
				),
		})
	);
}

events.on('products:changed', (products: IProduct[]) => {
	renderCards(products);
});

events.on('preview:selected', (product: IProduct) => {
	renderPreview(product);
	modal.open();
});

events.on(
	'basket:changed',
	(basket: string[]) => (page.basketCounter = basket.length)
);

events.on('basket:open', () => {
	renderBasket();
	modal.open();
});

events.on('basket:remove', (product: IProduct) => {
	storage.removeProductFromBasket(product.id);
	renderBasket();
});

events.on('basket:submit', () => {
	storage.clearOrder();
	modal.render(orderElement.render(storage.order));
});

events.on('preview:submit', (product: IProduct) => {
	if (storage.basketState(product.id)) {
		storage.removeProductFromBasket(product.id);
		renderPreview(product);
	} else {
		storage.addProductToBasket(product);
		renderPreview(product);
	}
});

events.on('contacts:submit', (data: IBasketContacts) => {
	storage.contacts = data;
	api
		.addOrder(storage.getCurrentOrder())
		.then((result) => {
			storage.clearOrder();
			storage.clearContacts();
			storage.clearBasket();
			modal.render(successElement.render(result));
		})
		.catch((e) => console.error(e));
});

events.on('order:submit', (data: IBasketOrder) => {
	storage.order = data;
	storage.clearContacts();
	modal.render(contactsElement.render(storage.contacts));
});

events.on('success:submit', modal.close.bind(modal));

events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
});
