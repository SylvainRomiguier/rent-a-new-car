import { z } from "zod";
import { ValueObject } from "./ValueObject";

export const yearValidator = z.number().int().min(1886).max(new Date().getFullYear());

export class Year extends ValueObject<number> {
  constructor(value: number) {
    const parsedValue = yearValidator.parse(value);
    super(parsedValue);
  }
  equals(other: Year): boolean {
    return this.value === other.value;
  }
}
