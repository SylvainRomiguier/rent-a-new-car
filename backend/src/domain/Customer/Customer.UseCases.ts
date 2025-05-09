import { IPresenter } from "../common/IPresenter";
import { UUID } from "../common/UUID";
import { ICustomerService } from "../ICustomerService";
import { CustomerData, Customer, CustomerProperties } from "./Customer";

export class CustomerUseCases {
  constructor(private customerService: ICustomerService) {}

  async addCustomer(CustomerProperties: CustomerProperties): Promise<void> {
    const newId = new UUID().value;
    const customerData = { ...CustomerProperties, id: newId };
    const newCustomer = new Customer(customerData);
    await this.customerService.addCustomer(newCustomer.value);
  }

  async getCustomerById(
    customerId: string,
    presenter: IPresenter<CustomerData>
  ): Promise<void> {
    const id = new UUID(customerId);
    const customerData = await this.customerService.getCustomerById(id.value);
    if (customerData) {
      presenter.present(new Customer(customerData).value);
      return;
    }
    throw new Error("Customer not found");
  }

  async getAllCustomers(
    presenter: IPresenter<CustomerData[]>
  ): Promise<void> {
    const customerDataList = await this.customerService.getAllCustomers();
    const customers = customerDataList.map((customerData) => new Customer(customerData));
    presenter.present(customers.map((customer) => customer.value));
  }

  async updateCustomer(
    customerId: string,
    customerData: CustomerData
  ): Promise<void> {
    const id = new UUID(customerId);
    const customerDto = await this.customerService.getCustomerById(id.value);
    if (customerDto) {
      const customer = new Customer(customerDto);
      const updatedCustomer = new Customer({
        ...customer.value,
        ...customerData,
      });
      await this.customerService.updateCustomer(
        id.value,
        updatedCustomer.value
      );
    }
  }

  async deleteCustomer(customerId: string): Promise<void> {
    const id = new UUID(customerId);
    const customerDto = await this.customerService.getCustomerById(id.value);
    if (customerDto) {
      const customer = new Customer(customerDto);
      await this.customerService.deleteCustomer(customer.value.id);
    }
  }
}
