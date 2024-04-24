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

## Базовый код

### Базовый класс API

Осуществляет основные операции по обмену данными с серверным API, включая получение и отправку информации.

### Базовый класс EventEmitter

Реализует управление событиями, включая добавление и удаление обработчиков событий, а также их активацию при наступлении событий.

### Базовый абстрактный класс Model

Этот абстрактный класс определяет конструктор для всех моделей приложения. Он принимает аргументы, которые соответствуют частям данных дженерика, связанного с интерфейсом модели, и экземпляр брокера событий типа `IEvents`. Кроме того, класс содержит метод `emitChanges`, который использует `EventEmitter` для уведомления о любых изменениях в данных.

### Базовый абстрактный класс View

Абстрактный класс, определяющий конструктор для всех отображений приложения, а также метод `render`, который связывает DOM-элемент с отображением, используя определенные параметры `args`. Включает список событий, связанных с отображением, и брокер событий для передачи сообщений о внутренних событиях.
