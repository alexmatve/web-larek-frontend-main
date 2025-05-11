import {IEvents} from "./events";

// Гарда для проверки на модель
export const isModel = (obj: unknown): obj is Model<any> => {
    return obj instanceof Model;
}

/**
 * Базовая модель, чтобы можно было отличить ее от простых объектов с данными
 */
export abstract class Model<T> {
    constructor(data: Partial<T>, protected events: IEvents) {
        Object.assign(this, data); // — копирует свойства из data прямо в экземпляр модели (this). Это способ быстро присвоить значения полям объекта на основе входных данных.
    }

    // Сообщить всем что модель поменялась
    emitChanges(event: string, payload?: object) {
        // Состав данных можно модифицировать
        this.events.emit(event, payload ?? {});
    }

    // далее можно добавить общие методы для моделей, блоки данных для моделей формы
}