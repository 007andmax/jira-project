import { InventoryItem } from "src/app/components/inventory/class/inventory-item";
import { GlNumberUseCategory } from "./gl-number-use-category";
import { GlNumberUseProduct } from "./gl-number-use-product";
import { GlNumberUseService } from "./gl-number-use-service";

export class GlNumberUse {
    valid: boolean;
    products: Array<GlNumberUseProduct> = [];
    services: Array<GlNumberUseService> = [];
    categories: Array<GlNumberUseCategory> = [];
    constructor(data) {
        this.valid = data.valid;
        this.products = data.products.map(item => new GlNumberUseProduct(item));
        this.services = data.services.map(item => new GlNumberUseService(item));
        this.categories = data.categories.map(item => new GlNumberUseCategory(item));
    }
}