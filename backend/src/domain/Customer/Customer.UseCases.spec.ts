import { CustomerUseCases } from "./Customer.UseCases";
import { CustomerData } from "./Customer";
import { describe, beforeEach, it } from "node:test";
import { InMemoryCustomerService } from "../__tests__/CustomerService.InMemory";

import assert from "node:assert";
import { customersFixture } from "../__tests__/customers.fixture";

describe("Use Cases", () => {
  let useCase: CustomerUseCases;
  const newCustomerId = "2dbaedcd-d652-4467-8ec2-e9e0fd685e2a";
  const newCustomerData: CustomerData = {
    lastName: "Doe",
    firstName: "John",
    email: "johndoe@example.com",
    phone: "+330612345678",
    address: {
      street: "15 rue des Champs-Élysées",
      city: "Paris",
      postalCode: "75001",
      country: "France",
    },
  };
  beforeEach(() => {
    useCase = new CustomerUseCases(new InMemoryCustomerService());
  });

  it("should add customer", async () => {
    await useCase.addCustomer(newCustomerData);
    const customers = await useCase.getAllCustomers();
    const { id, ...lastAdded } = customers[customers.length - 1].value;

    assert.deepEqual(lastAdded, newCustomerData);
  });

  it("should get customer by id", async () => {
    const customerId = "123e4567-e89b-12d3-a456-426614174002";
    const customer = await useCase.getCustomerById(customerId);
    assert.deepEqual(customer?.value, {
      id: "123e4567-e89b-12d3-a456-426614174002",
      firstName: "Mike",
      lastName: "Williams",
      email: "mike@example.com",
      phone: "+33612345678",
      address: {
        street: "543 Cedar St",
        city: "Anytown",
        postalCode: "12345",
        country: "USA",
      },
    });
  });

  it("should get all customers", async () => {
    const customerDataList = customersFixture;
    const customers = await useCase.getAllCustomers();
    assert.deepEqual(
      customers.map((customer) => customer.value),
      customerDataList
    );
  });

  it("should update customer", async () => {
    const customerId = "a3de1c07-b312-485b-91aa-89c73bb7879d";
    const addedCustomerData: CustomerData = {
      id: customerId,
      ...newCustomerData,
    };
    await useCase.addCustomer(addedCustomerData);
    const updatedCustomerData: CustomerData = {
      ...addedCustomerData,
      lastName: "Doe",
      firstName: "Jane",
    };
    await useCase.updateCustomer(customerId, updatedCustomerData);
    const updatedCustomer = await useCase.getCustomerById(customerId);
    assert.deepEqual(updatedCustomer?.value, {
      ...addedCustomerData,
      lastName: "Doe",
      firstName: "Jane",
    });
  });

  it("should delete customer", async () => {
    const customerId = "a3de1c07-b312-485b-91aa-89c73bb7879e";
    const addedCustomerData: CustomerData = {
      id: customerId,
      ...newCustomerData,
    };
    await useCase.addCustomer(addedCustomerData);
    await useCase.deleteCustomer(customerId);
    const customer = await useCase.getCustomerById(customerId);
    assert.strictEqual(customer, undefined);
  });
});
