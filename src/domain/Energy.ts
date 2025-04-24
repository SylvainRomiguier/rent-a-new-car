import { z } from "zod";
import { ValueObject } from "./ValueObject";

export const energyValidator = z.enum([
  "GASOLINE",
  "DIESEL",
  "ELECTRIC",
  "HYBRID",
  "HYDROGEN",
  "ETHANOL",
  "BIOFUEL",
  "LPG",
]);

export class Energy extends ValueObject<string> {
  constructor(value: string) {
    const parsedValue = energyValidator.parse(value);
    super(parsedValue);
  }
  equals(other: Energy): boolean {
    return this.value === other.value;
  }
}