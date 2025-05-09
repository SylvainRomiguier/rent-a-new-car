import { z } from "zod";
import { ValueObject } from "../common/ValueObject";

export const energyTypes = [
  "GASOLINE",
  "DIESEL",
  "ELECTRIC",
  "HYBRID",
  "HYDROGEN",
  "ETHANOL",
  "BIOFUEL",
  "LPG",
  "CNG",
] as const;

export const energyValidator = z.enum(energyTypes);

export type EnergyType = z.infer<typeof energyValidator>;

export class Energy extends ValueObject<string> {
  constructor(value: string) {
    const parsedValue = energyValidator.parse(value);
    super(parsedValue);
  }
  equals(other: Energy): boolean {
    return this.value === other.value;
  }
}
