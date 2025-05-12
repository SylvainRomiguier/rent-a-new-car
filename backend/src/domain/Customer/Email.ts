import { z } from "zod";
import { ValueObject } from "../common/ValueObject";

export const emailValidator = z.string().email().max(100);

export class Email extends ValueObject<string> {
  constructor(value: string) {
    const parsedValue = emailValidator.parse(value);
    super(parsedValue);
  }
}
