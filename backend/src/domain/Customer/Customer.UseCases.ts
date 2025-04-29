import { UUID } from "../common/UUID";
import { ICustomerService } from "../ICustomerService";
import { CustomerData, Customer } from "./Customer";

export class CustomerUseCases {
  constructor(
    private customerService: ICustomerService
  ) {}

  async addCustomer(customerData: CustomerData): Promise<void> {
    const newCustomer = new Customer(customerData);
    await this.customerService.addCustomer(newCustomer.value);
  }

  async getCustomerById(customerId: string): Promise<Customer | undefined> {
    const id  = new UUID(customerId);
    const customerData = await this.customerService.getCustomerById(id.value);
    if (customerData) {
      return new Customer(customerData);
    }
    return undefined;
  }

  async getAllCustomers(): Promise<Customer[]> {
    const customerDataList = await this.customerService.getAllCustomers();
    return customerDataList.map((customerData) => new Customer(customerData));
  }

  async updateCustomer(customerId: string, customerData: CustomerData): Promise<void> {
    const id = new UUID(customerId);
    const customer = await this.getCustomerById(id.value);
    if (customer) {
      const updatedCustomer = new Customer(
        { ...customer.value, ...customerData }
      );
      await this.customerService.updateCustomer(id.value, updatedCustomer.value);
    }
  }

  async deleteCustomer(customerId: string): Promise<void> {
    const id = new UUID(customerId);
    const customer = await this.getCustomerById(id.value);
    if (customer) {
      await this.customerService.deleteCustomer(id.value);
    }
  }
  
}
