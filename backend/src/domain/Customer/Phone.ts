import { z } from "zod";
import { ValueObject } from "../common/ValueObject";

export const phoneValidator = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format");
// This regex allows for international phone numbers in E.164 format
// (e.g., +123456789012345) and ensures that the number starts with a '+' followed by 1-14 digits.
// Adjust the regex as needed to match your specific phone number format requirements.
// You can also use other libraries like libphonenumber-js for more complex validation.

export class Phone extends ValueObject<string> {
  constructor(value: string) {
    const parsedValue = phoneValidator.parse(value);
    super(parsedValue);
  }
}
