import { CustomerUseCases } from "./Customer.UseCases";
import { CustomerData, CustomerProperties } from "./Customer";
import { describe, beforeEach, it } from "node:test";
import { InMemoryCustomerService } from "../__tests__/CustomerService.InMemory";

import assert from "node:assert";
import { customersFixture } from "../__tests__/customers.fixture";

describe("Customer Use Cases", () => {
  let useCase: CustomerUseCases;
  const newCustomerId = "2dbaedcd-d652-4467-8ec2-e9e0fd685e2a";
  const newCustomerData: CustomerProperties = {
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

  class CustomerPresenter {
    presentedValue: CustomerData | undefined;
    present(value: CustomerData): void {
      this.presentedValue = value;
    }
  }
  class CustomersPresenter {
    presentedValue: CustomerData[] = [];
    present(value: CustomerData[]): void {
      this.presentedValue = value;
    }
  }

  beforeEach(() => {
    useCase = new CustomerUseCases(new InMemoryCustomerService());
  });

  it("should add customer", async () => {
    await useCase.addCustomer(newCustomerData);
    const customersPresenter = new CustomersPresenter();
    await useCase.getAllCustomers(customersPresenter);
    const { id, ...lastCustomerAdded } =
      customersPresenter.presentedValue[
        customersPresenter.presentedValue.length - 1
      ];
    assert.deepEqual(lastCustomerAdded, newCustomerData);
  });

  it("should get customer by id", async () => {
    const customerId = "123e4567-e89b-12d3-a456-426614174002";
    const customerPresenter = new CustomerPresenter();
    await useCase.getCustomerById(customerId, customerPresenter);
    assert.deepEqual(customerPresenter.presentedValue, {
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
    const customersPresenter = new CustomersPresenter();
    await useCase.getAllCustomers(customersPresenter);
    assert.deepEqual(customersPresenter.presentedValue, customerDataList);
  });

  it("should update customer", async () => {
       const customerId = "123e4567-e89b-12d3-a456-426614174002";

    const updatedCustomerData: CustomerData = {
       id: "123e4567-e89b-12d3-a456-426614174002",
      firstName: "John",
      lastName: "Williams",
      email: "mike@example.com",
      phone: "+33612345678",
      address: {
        street: "543 Cedar St",
        city: "Anytown",
        postalCode: "12345",
        country: "Canada",
      },
    };
    await useCase.updateCustomer(customerId, updatedCustomerData);
    const customerPresenter = new CustomerPresenter();
    await useCase.getCustomerById(customerId, customerPresenter);
    assert.deepEqual(customerPresenter.presentedValue, updatedCustomerData);
  });

  it("should delete customer", async () => {
     const customerId = "123e4567-e89b-12d3-a456-426614174002";
    await useCase.deleteCustomer(customerId);
    const customerPresenter = new CustomerPresenter();
    await assert.rejects(
      () => useCase.getCustomerById(customerId, customerPresenter),
      (err) => {
        assert.strictEqual((err as Error).message, "Customer not found");
        return true;
      }
    );
  });
});
