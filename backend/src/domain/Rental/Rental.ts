import { z } from "zod";
import { UUID, UUIDValidator } from "../common/UUID";
import { CustomDate, customDateValidator } from "./CustomDate";
import {
  RentalStatus,
  RentalStatusType,
  rentalStatusValidator,
} from "./RentalStatus";
import { Price, priceValidator } from "../common/Price";

export const rentalValidator = z.object({
  id: UUIDValidator.optional(),
  customerId: UUIDValidator,
  carId: UUIDValidator,
  startDate: customDateValidator,
  endDate: customDateValidator,
  status: rentalStatusValidator,
  totalPrice: priceValidator,
});
export type RentalData = z.infer<typeof rentalValidator>;
export class Rental {
  id: UUID;
  customerId: UUID;
  carId: UUID;
  startDate: CustomDate;
  endDate: CustomDate;
  status: RentalStatus;
  totalPrice: Price;

  constructor(data: RentalData) {
    const parsedData = rentalValidator.parse(data);
    this.id = new UUID(parsedData.id);
    this.customerId = new UUID(parsedData.customerId);
    this.carId = new UUID(parsedData.carId);
    this.startDate = new CustomDate(parsedData.startDate);
    this.endDate = new CustomDate(parsedData.endDate);
    this.status = new RentalStatus(parsedData.status);
    this.totalPrice = new Price(parsedData.totalPrice);
  }

  get value(): RentalData {
    return {
      id: this.id.value,
      customerId: this.customerId.value,
      carId: this.carId.value,
      startDate: this.startDate.value,
      endDate: this.endDate.value,
      status: this.status.value as RentalStatusType,
      totalPrice: this.totalPrice.value,
    };
  }

  complete(): void {
    this.status = new RentalStatus(rentalStatusValidator.enum.completed);
  }

  isOverlapping(other: Rental): boolean {
    return (
      (this.startDate.isBefore(other.endDate) &&
        this.endDate.isAfter(other.startDate)) ||
      (other.startDate.isBefore(this.endDate) &&
        other.endDate.isAfter(this.startDate))
    );
  }
}
