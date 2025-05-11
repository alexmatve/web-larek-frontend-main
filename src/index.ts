import './scss/styles.scss';
import {EventEmitter} from './components/base/events';
import { LarekAPI } from './components/LarekAPI';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureAllElements, ensureElement } from './utils/utils';
import { Page } from './components/Page';
import { Modal } from './components/common/Modal';
import { AppState, CatalogChangeEvent, ProductItem } from './components/AppData';
import { CardBasket, CatalogItem, PreviewItem } from './components/Card';
import { Basket } from './components/common/Basket';
import { OrderContacts, OrderPayment } from './components/Order';
import { ICustomerData } from './types/models';
import { IOrderData } from './types/views';
import { Success } from './components/common/Success';

const events = new EventEmitter();
const api = new LarekAPI(CDN_URL, API_URL);


events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
})

const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

const modalContainer = ensureElement<HTMLElement>('#modal-container');

const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(modalContainer, events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const orderPayment = new OrderPayment(cloneTemplate(orderTemplate), events);
const orderContacts = new OrderContacts(cloneTemplate(contactsTemplate), events);

const openedModal = document.querySelector('.modal_active');
openedModal.classList.remove('modal_active');

api.getProductsList()
    .then(appData.setCatalog.bind(appData))
    .catch(err => {
        console.error(err);
    });


// Изменились элементы каталога
events.on<CatalogChangeEvent>('items:changed', () => {
    page.catalog = appData.catalog.map(item => {
        console.log(item);
        const card = new CatalogItem(cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:select', item)
        });
        card.setColorCategory(item.category);
        return card.render({
            title: item.title,
            image: item.image,
            category: item.category,
            price: item.price
        });

    });
    
});

events.on('card:select', (item: ProductItem) => {
    appData.setPreview(item);
});

events.on('preview:changed', (item: ProductItem) => {
    
    const showItem = (item: ProductItem) => {
        const card = new PreviewItem(cloneTemplate(cardPreviewTemplate), {
            onSubmit: () => {
                item.placeToBasket();
            }
        });

        modal.render({
            content: card.render({
                title: item.title,
                image: item.image,
                category: item.category,
                price: item.price,
                description: item.description
            })
        })
    }
    if (item) {
        api.getProduct(item.id)
            .then((result) => {
                item.description = result.description;
                showItem(item);
            })
            .catch((err) => {
                console.error(err);
            })
    } else {
        modal.close();
    }
})

// Изменение корзины
events.on('basket:changed', () => {
    // basket.setIndexes();
    page.counter = appData.getBoughtItems().length;


    basket.items = appData.getBoughtItems().map(item => {
        const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
            onClick: (event) => {
                item.status = 'inStock';
                events.emit('basket:changed', item);
            }
        });
        return card.render({
            index: appData.getIndex(item.id),
            title: item.title,
            price: item.price,
        });
    });
    
    appData.setOrderItems();
    appData.order.total = appData.getTotal();
    basket.price = appData.getTotal();
})

// Открытие корзины
events.on('basket:open', () => {
    modal.render({
        content: 
            basket.render()
    })
})


events.on('order:open', () => {
    modal.render({
        content: orderPayment.render({
            address: '',
            valid: false,
            errors: []
        })
    });
});


// Изменилось состояние валидации формы
events.on('formErrors:change', (errors: Partial<IOrderData>) => {
    const { address, phone, email } = errors;
    orderPayment.valid = !address;
    orderContacts.valid = !email && !phone

    orderPayment.errors = Object.values({address}).filter(i => !!i).join('; ');
    orderContacts.errors = Object.values({phone, email}).filter(i => !!i).join('; ');
});

// Изменилось одно из полей
events.on(/^order\..*:change/, (data: { field: keyof IOrderData, value: string }) => {

    appData.setOrderField(data.field, data.value);
    
});

events.on(/^contacts\..*:change/, (data: { field: keyof IOrderData, value: string }) => {
    
    appData.setOrderField(data.field, data.value);

});


events.on('order:submit', () => {
    appData.order.payment = orderPayment.payment;
    modal.render({
        content: orderContacts.render({
            phone: '',
            email: '',
            valid: false,
            errors: []
        })
    });
});

events.on('contacts:submit', () => {
    console.log(appData.order);
    api.postProduct(appData.order)
        .then((result) => {
            const success = new Success(cloneTemplate(successTemplate), {
                onClick: () => {
                    modal.close();
                    appData.clearBasket();
                    events.emit('basket:changed');
                }
            });
            
            modal.render({
                content: success.render({
                    total: result.total
                })
            });
        })
        .catch(err => {
            console.error(err);
        });
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
    page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
    page.locked = false;
});


