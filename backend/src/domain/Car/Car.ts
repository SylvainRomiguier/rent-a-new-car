import { z } from "zod";
import { UUIDValidator, UUID } from "../common/UUID";
import { nameValidator, Name } from "../common/Name";
import { yearValidator, Year } from "./Year";
import { mileageValidator, Mileage } from "./Mileage";
import { Price, priceValidator } from "../common/Price";
import { Energy, EnergyType, energyValidator } from "./Energy";
import { CustomDate } from "../Booking/CustomDate";
import { Booking, BookingData } from "../Booking/Booking";
import { bookingStatusValidator } from "../Booking/BookingStatus";

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

export type CarDataWithPendingBookings = CarData & {pendingBookings : BookingData[]}

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

export class CarWithPendingBookings extends Car {
  pendingBookings: Booking[] = [];

  constructor(data: CarData, pendingBookings: BookingData[]) {
    super(data);
    this.pendingBookings = pendingBookings.map(
      (booking) => new Booking(booking)
    );
  }

  get value(): CarDataWithPendingBookings {
    return {
      id: this.id.value,
      make: this.make.value,
      model: this.model.value,
      year: this.year.value,
      color: this.color.value,
      mileage: this.mileage.value,
      price: this.price.value,
      energy: this.energy.value as EnergyType,
      pendingBookings: this.pendingBookings.map((booking) => booking.value),
    };
  }

  book(customerId: UUID, startDate: CustomDate, endDate: CustomDate): Booking {
    const newBooking = new Booking({
      id: new UUID().value,
      customerId: customerId.value,
      carId: this.id.value,
      startDate: startDate.value,
      endDate: endDate.value,
      status: bookingStatusValidator.enum.pending,
      totalPrice:
        (this.price.value *
          (endDate.value.getTime() - startDate.value.getTime())) /
        (1000 * 3600 * 24),
    });

    if (this.pendingBookings.length > 0) {
      const overlappingBooking = this.pendingBookings.find((booking) =>
        booking.isOverlapping(newBooking)
      );
      if (overlappingBooking) {
        throw new Error("Car is already booked for the selected dates.");
      }
    }

    return newBooking;
  }
}