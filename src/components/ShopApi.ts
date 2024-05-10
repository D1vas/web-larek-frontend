import { Api, ApiListResponse } from './base/Api';
import { IOrder, IProduct, IShopApi, ISuccessOrder } from '../types';

export class ShopApi extends Api implements IShopApi {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getAllProducts(): Promise<IProduct[]> {
		return this.get('/product').then((data: ApiListResponse<IProduct>) =>
			data.items.map((item) => ({
				...item,
				image: item.image,
			}))
		);
	}

	addOrder(order: IOrder): Promise<ISuccessOrder> {
		return this.post('/order', order);
	}

	getProductById(id: string): Promise<IProduct> {
		return this.get(`/product/${id}`);
	}
}
