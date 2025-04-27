import { z } from "zod";
import { UUID, UUIDValidator } from "../common/UUID";
import { CustomDate, customDateValidator } from "./CustomDate";
import {
  BookingStatus,
  BookingStatusType,
  bookingStatusValidator,
} from "./BookingStatus";
import { Price, priceValidator } from "../common/Price";

export const bookingValidator = z.object({
  id: UUIDValidator.optional(),
  customerId: UUIDValidator,
  carId: UUIDValidator,
  startDate: customDateValidator,
  endDate: customDateValidator,
  status: bookingStatusValidator,
  totalPrice: priceValidator,
});
export type BookingData = z.infer<typeof bookingValidator>;
export class Booking {
  id: UUID;
  customerId: UUID;
  carId: UUID;
  startDate: CustomDate;
  endDate: CustomDate;
  status: BookingStatus;
  totalPrice: Price;

  constructor(data: BookingData) {
    const parsedData = bookingValidator.parse(data);
    this.id = new UUID(parsedData.id);
    this.customerId = new UUID(parsedData.customerId);
    this.carId = new UUID(parsedData.carId);
    this.startDate = new CustomDate(parsedData.startDate);
    this.endDate = new CustomDate(parsedData.endDate);
    this.status = new BookingStatus(parsedData.status);
    this.totalPrice = new Price(parsedData.totalPrice);
  }

  get value(): BookingData {
    return {
      id: this.id.value,
      customerId: this.customerId.value,
      carId: this.carId.value,
      startDate: this.startDate.value,
      endDate: this.endDate.value,
      status: this.status.value as BookingStatusType,
      totalPrice: this.totalPrice.value,
    };
  }

  complete(): void {
    this.status = new BookingStatus(bookingStatusValidator.enum.completed);
  }

  isOverlapping(other: Booking): boolean {
    return (
      (this.startDate.isBefore(other.endDate) &&
        this.endDate.isAfter(other.startDate)) ||
      (other.startDate.isBefore(this.endDate) &&
        other.endDate.isAfter(this.startDate))
    );
  }
}
