import { z } from "zod";
import { ValueObject } from "./ValueObject";

export const UUIDValidator = z.string().uuid();

export class UUID extends ValueObject<string> {
  constructor(value: string) {
    const parsedValue = UUIDValidator.parse(value);
    super(parsedValue);
  }
  equals(other: UUID): boolean {
    return this.value === other.value;
  }
}
