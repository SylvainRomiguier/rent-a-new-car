import { z } from "zod";
import { UUIDValidator, UUID } from "./UUID";
import { nameValidator, Name } from "./Name";
import { yearValidator, Year } from "./Year";
import { mileageValidator, Mileage } from "./Mileage";
import { Price, priceValidator } from "./Price";
import { Energy, EnergyType, energyValidator } from "./Energy";

const carValidator = z.object({
  id: UUIDValidator,
  make: nameValidator,
  model: nameValidator,
  year: yearValidator,
  color: nameValidator,
  mileage: mileageValidator,
  price: priceValidator,
  energy: energyValidator,
});

export type CarData = z.infer<typeof carValidator>;

export class Car {
  id: UUID;
  make: Name;
  model: Name;
  year: Year;
  color: Name;
  mileage: Mileage;
  price: Price;
  energy: Energy;

  constructor(data: CarData) {
    const parsedData = carValidator.parse(data);
    this.id = new UUID(parsedData.id);
    this.make = new Name(parsedData.make);
    this.model = new Name(parsedData.model);
    this.year = new Year(parsedData.year);
    this.color = new Name(parsedData.color);
    this.mileage = new Mileage(parsedData.mileage);
    this.price = new Price(parsedData.price);
    this.energy = new Energy(parsedData.energy);
  }

  get value(): CarData {
    return {
      id: this.id.value,
      make: this.make.value,
      model: this.model.value,
      year: this.year.value,
      color: this.color.value,
      mileage: this.mileage.value,
      price: this.price.value,
      energy: this.energy.value as EnergyType,
    };
  }
}
