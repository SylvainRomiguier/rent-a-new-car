import { CustomerData } from "../../../domain/Customer/Customer";
import { IPresenter } from "../../../domain/common/IPresenter";

export class CustomersArrayJsonPresenter implements IPresenter<CustomerData[]> {
  presentedValue: CustomerData[] = [];
  present(customers: CustomerData[]): void {
    this.presentedValue = customers;
  }
}
