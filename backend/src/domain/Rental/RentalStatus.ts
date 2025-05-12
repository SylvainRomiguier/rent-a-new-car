import { z } from "zod";
import { ValueObject } from "../common/ValueObject";

export const rentalStatusValidator = z.enum(["pending", "completed"]);

export type RentalStatusType = z.infer<typeof rentalStatusValidator>;

export class RentalStatus extends ValueObject<string> {
  constructor(value: string) {
    const parsedValue = rentalStatusValidator.parse(value);
    super(parsedValue);
  }
}
