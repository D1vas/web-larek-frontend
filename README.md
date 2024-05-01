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
`handleResponse`
Обрабатывает ответы от сервера, разрешая Promise с данными или выбрасывая ошибку.
`get`
Выполняет GET-запрос к API по указанному URI.
`post`
Выполняет POST-запрос к API по указанному URI с переданными данными.

### Базовый класс EventEmitter

Реализует управление событиями, включая добавление и удаление обработчиков событий, а также их активацию при наступлении событий.

```typescript
// Подписка на событие
on<T extends object>(eventName: EventName, callback: (event: T) => void): void {}

// Отписка от события
off(eventName: EventName, callback: Subscriber): void {}

// Подписка на все события
onAll(callback: (event: EmitterEvent) => void): void {}

// Отписка от всех событий
offAll(): void {}

// Уведомление подписчиков о наступлении события
emit<T extends object>(eventName: string, data?: T): void {}

// Делает коллбек триггером, генерирующим событие при вызове
trigger<T extends object>(eventName: string, context?: Partial<T>): void {}

```

### Базовый абстрактный класс Model

Абстрактный класс для создания моделей данных с возможностью управления данными и оповещения других компонентов о изменениях в этих моделях.

Имеет метод 
```typescript
// Уведомляет подписчиков об изменениях в модели и передает данные payload с помощью EventEmitter.
emitChanges(event: string, payload?: object)
```

##  Компоненты модели данных

### Класс ShopAPI

Специальный компонент для взаимодействия с API магазина отвечает за выполнение операций, связанных с получением списка товаров и оформлением заказа. Этот компонент наследуется от базового класса API и использует тип `TOrderInvoice` при оформлении заказа.

### Класс Catalog
Этот класс наследуется от базового класса Model и представляет модель для коллекции товаров на главной странице. Он используется для хранения и обработки данных о товарах. Внутри себя он хранит список объектов, которые поддерживают интерфейс `IProduct` (чтобы иметь доступ к их методам конвертации). При добавлении новых объектов в эту коллекцию генерируется событие 'catalog:items-changed', на которое реагируют другие компоненты, такие как Card и Page, для обновления списка карточек товаров.

### Класс Basket

Класс для отображения корзины, содержащий набор позиций корзины и их общую сумму, а также предоставляющий возможность выполнения действий при клике на кнопку оформления.

Используемые методы:
```typescript
// Добавляет товар в корзину
add(item: IProduct): void {}

// Удаляет товар из корзины по id
remove(id: string): void {}

// Проверяет, содержится ли товар с данным id в корзине
contains(id: string): boolean {}

// Возвращает массив id в виде строк
getIdList(): string[] {}

// Очищает корзину
clear(): void {}

// Возвращает массив объектов товаров из защищенного свойства items
get items(): IProduct[] {}

// Возвращает общую стоимость всех товаров в корзине
get total(): number {}

// Возвращает длину массива _items
get length(): number {}
```

### Класс Order
Этот класс представляет модель для заказа, используется для хранения и обработки данных о заказе.

Используемые методы:
```typescript
// Устанавливает способ оплаты
set payment(value: PaymentMethod): void {}

// Устанавливает адрес
set address(value: string): void {}

// Устанавливает email
set email(value: string): void {}

// Устанавливает номер телефона
set phone(value: string): void {}

// Устанавливает общую стоимость товаров в заказе
set total(value: number): void {}

// Устанавливает список товаров заказа в виде массива из id
set items(list: string[]): void {}

// Возвращает объект, подходящий для отправки в API post запросе
toApiObject(): IOrderData {}
```
##   Компоненты представления

### Класс Modal
Наследуется от базового класса `View`

Отображает модальное окно на странице. Он предоставляет методы для открытия и закрытия модального окна, а также управляет своим содержимым.

Имеет основной набор методов для управления состоянием модального окна:
```typescript
// Открыть модальное окно
open(): void{}
// Закрыть модальное окно
close(): void{}
```

### Класс Form
Наследуется от базового класса `View`

Контролирует отображение ошибок валидации, обеспечивает прослушивание событий отправки формы и позволяет вносить изменения в поля формы.

Используемые методы:
```typescript
// Получение статуса валидности формы
get valid(): boolean {}

// Установка статуса валидности формы
set valid(value: boolean): void {}

// Установка текста ошибки
set error(value: string): void {}

// Очистка формы
clear(): void {}
```

### Класс Page
Наследуется от базового класса `View`

Отображение самой страницы. Контролирует возможность скроллинга
Используемые методы:
```typescript
// Устанавливает значение в счетчике товаров корзины
set counter(value: string): void {}

// Блокирует или разблокирует прокрутку страницы
lockScroll(state: boolean): void {}
```



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



































