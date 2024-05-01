# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Архитектура проекта

Ниже приведено описание общей архитектуры приложения, списка событий и данных, передаваемых в рамках каждого события.

##   Базовый код

### Базовый класс API

Этот класс предоставляет базовые методы для работы с API и позволяет легко взаимодействовать с удаленным сервером, отправлять запросы и получать ответы, а также обрабатывать ошибки.

#### Конструктор:
Принимает базовый URL для API `baseUrl` и опциональные параметры `options` для настройки запросов.
Устанавливает базовый URL и опции запроса.

#### Поля:
`baseUrl: string;` - базовый url на api.
`options: RequestInit` - объект с настройками для формирования запроса.

#### Методы:
`handleResponse`- обрабатывает ответы от сервера, разрешая Promise с данными или выбрасывая ошибку.
`get` - выполняет GET-запрос к API по указанному URI.
`post` - выполняет POST-запрос к API по указанному URI с переданными данными.

### Базовый класс EventEmitter

Реализует управление событиями, включая добавление и удаление обработчиков событий, а также их активацию при наступлении событий.

#### Конструктор:
Создает экземпляр объекта `Map`

#### Методы:
`on<T extends object>(eventName: EventName, callback: (event: T) => void): void` -устанавливает обработчик на событие.
`off(eventName: EventName, callback: Subscriber): void` - снимает обработчик с события.
`emit<T extends object>(eventName: string, data?: T): void` - инициирует событие с данными.
`onAll(callback: (event: EmitterEvent) => void): void` - слушает все события.
`offAll(): void` - сбрасывает все обработчики.
`trigger<T extends object>(eventName: string, context?: Partial<T>): (event: object) => void` - создает коллбек триггер, генерирующий событие при вызове.


### Базовый абстрактный класс Model

Абстрактный класс для создания моделей данных с возможностью управления данными и оповещения других компонентов о изменениях в этих моделях.

#### Конструктор:
`container: HTMLElement` - элемент DOM, в который будет рендериться модель.
`events: IEvents` - интерфейс для работы с событиями.

#### Поля:
`events: IEvents` - объект, являющимся брокером событий, поддерживает интерфейс IEvents.

#### Методы:
`render(obj: Partial<T>): HTMLElement` - принимает объект данных, объединяет его с текущей моделью и возвращает элемент DOM, к которому привязана модель.

##  Компоненты модели данных

### Класс ShopAPI

Класс `ShopApi` расширяет базовый класс `Api` и предоставляет методы для работы с API магазина, такие как получение всех продуктов, добавление заказа и получение продукта по его id.

#### Конструктор:
Конструктор класса `ShopApi` принимает три параметра: `cdn` (URL для CDN), `baseUrl` (базовый URL API магазина) и опциональные `options` (настройки запроса).

#### Поля:
`cdn: string` - URL для Content Delivery Network (CDN), который используется для загрузки изображений.
`baseUrl: string` - базовый URL для API магазина, унаследованный от базового класса Api.
`options: RequestInit` - опции запроса, такие как заголовки, унаследованные от базового класса Api.

#### Методы:
`getAllProducts()` Получает все продукты из API магазина и возвращает Promise с массивом объектов IProduct.
`addOrder(order: IOrder)` Отправляет запрос на добавление заказа в API магазина с данными заказа order и возвращает Promise с объектом ISuccessOrder, представляющим успешно добавленный заказ.
`getProductById(id: string)` Получает продукт по его идентификатору из API магазина и возвращает Promise с объектом IProduct.

### Класс AppData

#### Конструктор
Принимает объект events интерфейса `IEvents` для работы с событиями.
Вызывает методы `clearBasket`, `clearOrder` и `clearContacts` для инициализации состояния.

#### Поля
`_basket: string[]` - массив идентификаторов продуктов в корзине.
`_products: IProduct[]` - массив продуктов.
`_order: IBasketOrder` - объект заказа.
`_contacts: IBasketContacts` - контактные данные для заказа.

#### Методы
`set products(items: IProduct[])` Устанавливает массив продуктов и генерирует событие `products:changed`.
`get products(): IProduct[]` Возвращает массив продуктов.
`getProductById(id: string)` IProduct: Возвращает продукт по его идентификатору.
`clearBasket()` Очищает корзину.
`clearOrder()` Очищает заказ.
`clearContacts()` Очищает контактные данные.
`addProductToBasket(product: IProduct)` Добавляет продукт в корзину.
`removeProductFromBasket(productId: string)` Удаляет продукт из корзины.
`getProductsInBasket(): IProduct[]` Возвращает продукты, находящиеся в корзине.
`isInBasket(productId: string): boolean` Проверяет, есть ли продукт в корзине.
`set order(basketOrder: IBasketOrder)` Устанавливает данные заказа.
`get order()` Возвращает данные заказа.
`set contacts(value: IBasketContacts)` Устанавливает контактные данные.
`get contacts()` Возвращает контактные данные.
`getCurrentOrder(): IOrder` Возвращает текущий заказ.
`getBasketTotalPrice(): number` Возвращает общую стоимость продуктов в корзине.

### Класс Basket

Класс для отображения корзины, содержащий набор позиций корзины и их общую сумму, а также предоставляющий возможность выполнения действий при клике на кнопку оформления.

#### Конструктор
Принимает шаблон корзины `template` типа `HTMLTemplateElement` и объект `events` интерфейса `IEvents` для работы с событиями.
Вызывает конструктор базового класса `Model` с клонированным шаблоном.
Инициализирует элементы корзины `(basketCardListElement, submitButton, priceElement)` и добавляет обработчик события на кнопку `"submit"`.

#### Поля
`basketCardListElement: HTMLUListElement` - элемент `<ul>`, содержащий список товаров в корзине.
`submitButton: HTMLButtonElement` - кнопка оформления.
`priceElement: HTMLSpanElement` - элемент для отображения цены корзины.

#### Методы
`set price(price: number)` Устанавливает цену корзины и блокирует/разблокирует кнопку `"submit"`.
`set cards(elements: HTMLElement[])` Устанавливает элементы товаров в корзине.

### Класс Order
Этот класс представляет модель для заказа, используется для хранения и обработки данных о заказе.

#### Конструктор
Принимает контейнер формы заказа `container` и объект событий `events`, инициализирует элементы формы и добавляет обработчики.

#### Поля
`_payment: 'card' | 'cash'` - тип оплаты текущего заказа.
`cardButtonElement: HTMLButtonElement` - кнопка выбора оплаты картой.
`cashButtonElement: HTMLButtonElement` - кнопка выбора оплаты наличными.
`addressElement: HTMLInputElement` - поле для ввода адреса доставки.
`orderButtonElement: HTMLButtonElement` - кнопка подтверждения заказа.

#### Методы
`set address(address: string)` - устанавливает значение адреса в поле для ввода.
`set payment(payment: TOrderPayment)` - устанавливает тип оплаты и обновляет визуальное состояние кнопок оплаты.
`get payment()` - возвращает текущий тип оплаты.
`updateOrderButtonState()` - обновляет состояние кнопки заказа в зависимости от заполненности полей адреса и выбранного типа оплаты.




### Класс Modal
Наследуется от базового класса `Model`. Отвечает за отображение модального окна и действий над ним.

#### Конструктор
Принимает контейнерный элемент `container` и объект `events` для управления событиями. Инициализирует поля `container`, `closeButton` и `innerContent`, устанавливает обработчики событий.

#### Поля
`closeButton: HTMLButtonElement` - кнопка закрытия модального окна.
`innerContent: HTMLDivElement` - контент модального окна.

#### Методы
`close(): void` - закрывает модальное окно.
`open(): void` - открывает модальное окно.
`render(obj: HTMLElement): HTMLElement` - заменяет содержимое внутреннего контента модального окна переданным элементом.

### Класс Contacts
Создание графического интерфейса для оформления заказа, включая поля для ввода контактной информации, такой как номер телефона и электронная почта

#### Конструктор
Инициализирует поля `emailElement`, `phoneElement` и `submitButtonElement`, устанавливает обработчики событий.

#### Поля
`container: HTMLFormElement` - контейнерная форма, к которой привязан класс.
`emailElement: HTMLInputElement` - поле для ввода адреса электронной почты.
`phoneElement: HTMLInputElement` - поле для ввода номера телефона.
`submitButtonElement: HTMLButtonElement` - кнопка отправки формы.

#### Методы:
`updateSubmitButtonState(): void` - обновляет состояние кнопки отправки в зависимости от введенных значений в поля электронной почты и телефона.

### Класс Page
Представляет основную страницы приложения.

#### Конструктор
принимает корневой элемент страницы и объект событий `events`. 

#### Поля
`_productCards` - область, где отображаются карточки продуктов.
`_wrapper` - область-обертка страницы.
`_basketButton` - кнопка корзины.
`_basketCounter` - счетчик продуктов в корзине.

#### Методы:
`productCards` - устанавливает карточки продуктов для отображения на странице.
`basketCounter` - устанавливает количество продуктов в корзине.
`locked` - блокирует/разблокирует страницу путем добавления/удаления класса `page__wrapper_locked`.



### Класс SuccessOrder
Расширяет абстрактный класс `Model` и представляет компонент успешного заказа на странице. 

#### Конструктор
Конструктор принимает HTML-шаблон и объект событий. В конструкторе вызывается конструктор родительского класса `Model` с клонированным шаблоном и объектом событий.

#### Поля
`titleElement` - элемент заголовка успешного заказа.
`descriptionElement` - элемент описания успешного заказа.
`buttonElement` - кнопка закрытия успешного сообщения.

#### Методы:
`total` - устанавливает общую сумму заказа, отображая ее в описании успешного заказа.










Интерфейс `IProduct` нужен для описания товара

```typescript
interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}
```

Интерфейс `IAppState` необходим для описывания состояния приложения

```typescript
interface IAppState {
	catalog: IProduct;
	basket: string[];
	preview: string | null;
	order: IOrder | null;
}
```

Интерфейс `IOrderForm` используется для описания формы заказа

```typescript
interface IOrderForm {
	email: string;
	phone: string;
	address: string;
	payment: TOrderPayment;
}
```

Интерфейс `IOrder` расширяет `IOrderForm`
```typescript
interface IOrder extends IOrderForm {
	items: string[];
	total: number;
}
```

Для описания интерфейса результата заказа используется `IOrderResult`

```typescript
interface IOrderResult {
	id: string;
	total: number;
}
```

Для определения возможных способов оплаты заказа используется тип `TOrderPayment`.

```typescript
type TOrderPayment = 'cash' | 'card';
```

Тип использующийся для валидации формы заказа `FormErrors`

```typescript
type FormErrors = Partial<Record<keyof IOrder, string>>;
```

Для описания элементов корзины используеся тип `IBasketItem`

```typescript
type IBasketItem = Pick<IProduct, 'id' | 'title' | 'price'>;
```

```typescript
type ApiPostMethods = 'POST' | 'PUT' | 'DELETE'
```



































