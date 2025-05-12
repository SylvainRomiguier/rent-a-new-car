import { z } from "zod";
import { ValueObject } from "../common/ValueObject";

export const customDateValidator = z.date();

export class CustomDate extends ValueObject<Date> {
  constructor(value: Date | string | number) {
    const parsedValue = customDateValidator.parse(new Date(value));
    if (isNaN(parsedValue.getTime())) {
      throw new Error("Invalid date");
    }
    super(parsedValue);
  }

  isToday(): boolean {
    const today = new Date();
    return (
      this.value.getDate() === today.getDate() &&
      this.value.getMonth() === today.getMonth() &&
      this.value.getFullYear() === today.getFullYear()
    );
  }
  isBefore(other: CustomDate): boolean {
    return this.value < other.value;
  }

  isAfter(other: CustomDate): boolean {
    return this.value > other.value;
  }
}
