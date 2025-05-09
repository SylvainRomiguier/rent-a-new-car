import { z } from "zod";
import { Name, nameValidator } from "../common/Name";
import { UUID, UUIDValidator } from "../common/UUID";
import { Email, emailValidator } from "./Email";
import { Phone, phoneValidator } from "./Phone";
import { Address, addressValidator } from "./Address";


export const customerPropertiesValidator = z.object({
  firstName: nameValidator,
  lastName: nameValidator,
  email: emailValidator,
  phone: phoneValidator,
  address: addressValidator,
});
export type CustomerProperties = z.infer<typeof customerPropertiesValidator>;

export const customerValidator = customerPropertiesValidator.extend({
  id: UUIDValidator,
});

export type CustomerData = z.infer<typeof customerValidator>;
export class Customer {
  id: UUID;
  firstName: Name;
  lastName: Name;
  email: Email;
  phone: Phone;
  address: Address;

  constructor(data: CustomerData) {
    const parsedData = customerValidator.parse(data);
    this.id = new UUID(parsedData.id);
    this.firstName = new Name(parsedData.firstName);
    this.lastName = new Name(parsedData.lastName);
    this.email = new Email(parsedData.email);
    this.phone = new Phone(parsedData.phone);
    this.address = new Address(parsedData.address);
  }

  get value(): CustomerData {
    return {
      id: this.id.value,
      firstName: this.firstName.value,
      lastName: this.lastName.value,
      email: this.email.value,
      phone: this.phone.value,
      address: this.address.value,
    };
  }
}
