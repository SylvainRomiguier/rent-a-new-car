import { z } from "zod";
import { ValueObject } from "./ValueObject";
import { randomUUID } from "node:crypto";

export const UUIDValidator = z.string().uuid();

export class UUID extends ValueObject<string> {
  constructor(value?: string) {
    if (value === undefined) {
      value = randomUUID();
    }
    const parsedValue = UUIDValidator.parse(value);
    super(parsedValue);
  }
}
