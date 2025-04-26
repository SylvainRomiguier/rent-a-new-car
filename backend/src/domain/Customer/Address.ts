import { z } from "zod";
import { ValueObject } from "../common/ValueObject";

export const addressValidator = z.object({
  street: z.string().min(1).max(100),
  city: z.string().min(1).max(50),
  postalCode: z.string().min(1).max(20),
  country: z.string().min(1).max(50),
});
export type AddressType = z.infer<typeof addressValidator>;

export class Address extends ValueObject<AddressType> {
  constructor(value: AddressType) {
    const parsedValue = addressValidator.parse(value);
    super(parsedValue);
  }
  equals(other: Address): boolean {
    return (
      this.value.street === other.value.street &&
      this.value.city === other.value.city &&
      this.value.postalCode === other.value.postalCode &&
      this.value.country === other.value.country
    );
  }
}
