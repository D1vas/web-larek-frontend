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
В начале необходимо проверить наличие файла .env с ключом API_ORIGIN указывающий на адрес сервера API:

```
API_ORIGIN=https://example.com
```
для установки и запуска проекта необходимо выполнить команды

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

Для создания эффективного и понятного приложения на базе упрощённой версии шаблона MVP (Model-View-Presenter), где вся логика управления централизованно сосредоточена в "Presenter", важно чётко определить механизм взаимодействия между компонентами приложения через события. Ниже приведено описание общей архитектуры приложения, списка событий и данных, передаваемых в рамках каждого события.

Основные компоненты:
1. Model - отвечает за управление данными (загрузка, изменение, сохранение).
2. View - отвечает за отображение информации пользователю и интерактив с пользователем.
3. Presenter - слой, который связывает Model и View. Обрабатывает события от View, вызывает изменения в Model и обновляет View.

Для описания товара используется интерфейс IProduct:

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

Для описания возможных способов оплаты заказа используется тип TOrderPayment:

```typescript
type TOrderPayment = 'cash' | 'card';
```
Для описания заказа используется интерфейс IOrder:

```typescript
interface IOrder {
	items: IProduct[];
	payment: TOrderPayment;
	address: string;
	email: string;
	phone: string;
}
```
При оформлении заказа, формируется специальный объект для работы с API типа TOrderInvoice:

```typescript
type TOrderInvoice = Omit<IOrder, 'items'> & {
	items: string[];
	total: number;
};
```

Для отслеживания текущего этапа заказа используется тип TOrderStep:

```typescript
type TOrderStep = 'shipment' | 'contacts';
```

## Базовый код

### Базовый класс API

Осуществляет основные операции по обмену данными с серверным API, включая получение и отправку информации.
```typescript
type ApiPostMethods = 'POST' | 'PUT' | 'DELETE'
```
### Базовый класс EventEmitter

Реализует управление событиями, включая добавление и удаление обработчиков событий, а также их активацию при наступлении событий.
Класс реализует интерфейс `IEvents` и использует типы  `TSubscriber`, `TEmitterEvent` и `TEventName`.

```typescript
type TEventName = string | RegExp;

type TSubscriber = Function;

type TEmitterEvent = {
	eventName: string;
	data: unknown;
};

interface IEvents {
	on<T extends object>(event: TEventName, callback: (data: T) => void): void;
	emit<T extends object>(event: string, data?: T): void;
	trigger<T extends object>(
		event: string,
		context?: Partial<T>
	): (data: T) => void;
}
```

### Базовый абстрактный класс Model

Этот абстрактный класс определяет конструктор для всех моделей приложения. Он принимает аргументы, которые соответствуют частям данных дженерика, связанного с интерфейсом модели, и экземпляр брокера событий типа `Events`. Кроме того, класс содержит метод `emitChanges`, который использует `EventEmitter` для уведомления о любых изменениях в данных.


### Базовый абстрактный класс View

Абстрактный класс, определяющий конструктор для всех отображений приложения, а также метод `render`, который связывает DOM-элемент с отображением, используя определенные параметры `args`. Включает список событий, связанных с отображением, и брокер событий для передачи сообщений о внутренних событиях.

### Компоненты модели данных

Управляет данными в приложении и контролирует общий процесс его работы. Она обеспечивает взаимодействие между товарами, корзиной и заказом, выполняя функцию распределителя данных и управляя основными операциями, такими как добавление товаров в корзину, просмотр деталей товара, заполнение данных заказа и другие. 

Имеет поля интерфейса IFormState
```typescript
interface IFormState {
	preview: IProduct;
	products: IProduct[];
	basket: Set<IProduct>;
	order: IOrder;
}
```

Методы для управления приложением.

```typescript
// Инициализация нового заказа
initOrder() {}

// Установка товаров каталога
setProductsItems(value: IProduct[]) {}

// Установка текущего просматриваемого элемента
setPreview(value: IProduct) {}

// Добавление товара в корзину
addBasketItem(value: IProduct) {}

// Проверка на наличие товара в корзине
getBasketIsContains(id: string) {}

// Получение цены позиций в корзине
getBasketPrice() {}

// Инициализация корзины
initBasket() {}

// Удаление товара из корзины
removeBasketItem(id: string) {}

// Сброс текущего состояния корзины
resetBasket() {}

// Установка этапа оформления заказа
setStep(value: TOrderStep) {}

// Установка поля заказа
setOrderField(field: keyof IOrder, value: unknown) {}

// Получение ошибок текущего заказа
getOrderErrors() {}

// Сброс всех полей заказа
resetOrder() {}

// Проверка валидности текущего заказа
getOrderIsValid() {}

// Получение полей заказа в виде для взаимодействия с API
getOrderInvoice() {}

```
