import { z } from "zod";
import { UUIDValidator, UUID } from "../common/UUID";
import { nameValidator, Name } from "../common/Name";
import { yearValidator, Year } from "./Year";
import { mileageValidator, Mileage } from "./Mileage";
import { Price, priceValidator } from "../common/Price";
import { Energy, EnergyType, energyValidator } from "./Energy";
import { CustomDate } from "../Rental/CustomDate";
import { Rental, RentalData } from "../Rental/Rental";
import { rentalStatusValidator } from "../Rental/RentalStatus";

export const carPropertiesValidator = z.object({
  make: nameValidator,
  model: nameValidator,
  year: yearValidator,
  color: nameValidator,
  mileage: mileageValidator,
  price: priceValidator,
  energy: energyValidator,
});
export type CarProperties = z.infer<typeof carPropertiesValidator>;

export const carValidator = carPropertiesValidator.extend({
  id: UUIDValidator,
});

export type CarData = z.infer<typeof carValidator>;

export type CarDataWithPendingRentals = CarData & {
  pendingRentals: RentalData[];
};

export class Car {
  protected id: UUID;
  protected make: Name;
  protected model: Name;
  protected year: Year;
  protected color: Name;
  protected mileage: Mileage;
  protected price: Price;
  protected energy: Energy;

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

export class CarWithPendingRentals extends Car {
  pendingRentals: Rental[] = [];

  constructor(data: CarData, pendingRentals: RentalData[]) {
    super(data);
    this.pendingRentals = pendingRentals.map((rental) => new Rental(rental));
  }

  get value(): CarDataWithPendingRentals {
    return {
      id: this.id.value,
      make: this.make.value,
      model: this.model.value,
      year: this.year.value,
      color: this.color.value,
      mileage: this.mileage.value,
      price: this.price.value,
      energy: this.energy.value as EnergyType,
      pendingRentals: this.pendingRentals.map((rental) => rental.value),
    };
  }

  rent(customerId: UUID, startDate: CustomDate, endDate: CustomDate): Rental {
    const newRental = new Rental({
      id: new UUID().value,
      customerId: customerId.value,
      carId: this.id.value,
      startDate: startDate.value,
      endDate: endDate.value,
      status: rentalStatusValidator.enum.pending,
      totalPrice:
        (this.price.value *
          (endDate.value.getTime() - startDate.value.getTime())) /
        (1000 * 3600 * 24),
    });

    if (this.pendingRentals.length > 0) {
      const overlappingRental = this.pendingRentals.find((rental) =>
        rental.isOverlapping(newRental)
      );
      if (overlappingRental) {
        throw new Error("Car is already rented for the selected dates.");
      }
    }

    return newRental;
  }

  isAvailableBetweenDates(startDate: CustomDate, endDate: CustomDate): boolean {
    if (this.pendingRentals.length === 0) {
      return true;
    }

    for (const rental of this.pendingRentals) {
      try {
        this.rent(new UUID(), startDate, endDate);
        return true;
      } catch (_) {
        return false;
      }
    }

    return true;
  }
}
