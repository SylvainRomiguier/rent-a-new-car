import { z } from "zod";
import { ValueObject } from "../common/ValueObject";

export const bookingStatusValidator = z.enum([
  "pending",
  "completed",
]);

export type BookingStatusType = z.infer<typeof bookingStatusValidator>;

export class BookingStatus extends ValueObject<string> {
  constructor(value: string) {
    const parsedValue = bookingStatusValidator.parse(value);
    super(parsedValue);
  }
  equals(other: BookingStatus): boolean {
    return this.value === other.value;
  }
}
