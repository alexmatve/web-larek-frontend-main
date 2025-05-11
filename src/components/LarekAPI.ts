import {Api, ApiListResponse} from './base/api';
import { ICustomerData, ILarekAPI, IProduct, IProductPut, IProductResult } from '../types/models';
import { Id, Category, Title, Price, Image, Description, payment, Address, Email, phone } from "../types/controller";

export class LarekAPI extends Api implements ILarekAPI {
    readonly cdn: string;
    

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    getProductsList(): Promise<ApiListResponse<IProduct>> {
        return this.get(`/product/`).then(
            (data: ApiListResponse<IProduct>) => data
        );
    }

    getProduct(id: Id): Promise<IProductResult> {
        return this.get(`/product/${id}`).then(
            (item: IProductResult) => item
        );
    }

    postProduct(order: ICustomerData): Promise<IProductPut> {
        return this.post('/order', order).then(
            (data: IProductPut) => data
        );
    }
    
}
