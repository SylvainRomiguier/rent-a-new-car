import { z } from "zod";
import { UUIDValidator, UUID } from "../common/UUID";
import { nameValidator, Name } from "../common/Name";
import { yearValidator, Year } from "./Year";
import { mileageValidator, Mileage } from "./Mileage";
import { Price, priceValidator } from "../common/Price";
import { Energy, EnergyType, energyValidator } from "./Energy";
import { CustomDate } from "../Booking/CustomDate";
import { Booking } from "../Booking/Booking";
import { bookingStatusValidator } from "../Booking/BookingStatus";
import { IBookingService } from "../IBookingService";

const carValidator = z.object({
  id: UUIDValidator.optional(),
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
  pendingBookings: Booking[] = [];

  constructor(data: CarData, bookingService: IBookingService) {
    if(data.id) {
      bookingService.getPendingBookingsByCarId(data.id).then((bookings) => {
        this.pendingBookings = bookings.map((booking) => new Booking(booking));
      })
      .catch((error) => {
        console.error("Error fetching pending bookings:", error);
      });
    }
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

    if(this.pendingBookings.length > 0) {
      const overlappingBooking = this.pendingBookings.find((booking) => booking.isOverlapping(newBooking));
      if(overlappingBooking) {
        throw new Error("Car is already booked for the selected dates.");
      }
    }

    return newBooking;
  }

}
