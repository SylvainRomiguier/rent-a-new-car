import { CustomerData } from "./Customer/Customer";

export interface ICustomerService {
  getCustomerById(customerId: string): Promise<CustomerData | null>;
  getCustomersByIds(customerIds: string[]): Promise<CustomerData[]>;
  getCustomersByEmail(email: string): Promise<CustomerData[]>;
  getCustomersByName(name: string): Promise<CustomerData[]>;
  getCustomersByPhone(phone: string): Promise<CustomerData[]>;
  getAllCustomers(): Promise<CustomerData[]>;
  addCustomer(customer: CustomerData): Promise<void>;
  updateCustomer(customerId: string, customer: CustomerData): Promise<void>;
  deleteCustomer(customerId: string): Promise<void>;
}
