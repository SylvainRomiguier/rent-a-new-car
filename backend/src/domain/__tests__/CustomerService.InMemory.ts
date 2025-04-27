import { CustomerData } from "../Customer/Customer";
import { ICustomerService } from "../ICustomerService";
import { customersFixture } from "./customers.fixture";

export class InMemoryCustomerService implements ICustomerService {
  private customers: CustomerData[] = customersFixture;
  async getCustomerById(customerId: string): Promise<CustomerData | null> {
    const customer = this.customers.find((c) => c.id === customerId);
    return customer || null;
  }
  async getCustomersByIds(customerIds: string[]): Promise<CustomerData[]> {
    return this.customers.filter((c) => customerIds.includes(c.id!));
  }
  async getCustomersByEmail(email: string): Promise<CustomerData[]> {
    return this.customers.filter((c) => c.email === email);
  }

  async getCustomersByName(name: string): Promise<CustomerData[]> {
    return this.customers.filter(
      (c) => c.firstName === name || c.lastName === name
    );
  }

  async getCustomersByPhone(phone: string): Promise<CustomerData[]> {
    return this.customers.filter((c) => c.phone === phone);
  }

  async getAllCustomers(): Promise<CustomerData[]> {
    return this.customers;
  }

  async addCustomer(customer: CustomerData): Promise<void> {
    this.customers.push(customer);
  }

  async updateCustomer(
    customerId: string,
    customer: CustomerData
  ): Promise<void> {
    const index = this.customers.findIndex((c) => c.id === customerId);
    if (index !== -1) {
      this.customers[index] = { ...this.customers[index], ...customer };
    }
  }

  async deleteCustomer(customerId: string): Promise<void> {
    this.customers = this.customers.filter((c) => c.id !== customerId);
  }
}
