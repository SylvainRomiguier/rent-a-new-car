import { z } from "zod";
import { ValueObject } from "../common/ValueObject";

export const mileageValidator = z.number().int().min(0);

export class Mileage extends ValueObject<number> {
  constructor(value: number) {
    const parsedValue = mileageValidator.parse(value);
    super(parsedValue);
  }
  equals(other: Mileage): boolean {
    return this.value === other.value;
  }
}
