import { z } from "zod";
import { ValueObject } from "./ValueObject";

export const priceValidator = z.number().positive();

export class Price extends ValueObject<number> {
  constructor(value: number) {
    const parsedValue = priceValidator.parse(value);
    super(parsedValue);
  }
}
