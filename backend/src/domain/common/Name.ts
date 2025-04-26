import { z } from "zod";
import { ValueObject } from "./ValueObject";

export const nameValidator = z.string().min(1).max(50);

export class Name extends ValueObject<string> {
  constructor(value: string) {
    const parsedValue = nameValidator.parse(value);
    super(parsedValue);
  }
  equals(other: Name): boolean {
    return this.value === other.value;
  }
}
