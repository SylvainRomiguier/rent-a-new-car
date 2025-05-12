import { RentalData } from "../Rental/Rental";
import {
  RentalStatusType,
  rentalStatusValidator,
} from "../Rental/RentalStatus";
import { IRentalService } from "../IRentalService";

export class InMemoryRentalService implements IRentalService {
  private rentals: RentalData[] = [];
  async getRentalsByCustomerId(customerId: string): Promise<RentalData[]> {
    return this.rentals.filter((rental) => rental.customerId === customerId);
  }
  async getRentalsByCarId(carId: string): Promise<RentalData[]> {
    return this.rentals.filter((rental) => rental.carId === carId);
  }
  async getAllRentalsBetween2Dates(
    startDate: Date,
    endDate: Date
  ): Promise<RentalData[]> {
    return this.rentals.filter((rental) => {
      const rentalStartDate = new Date(rental.startDate);
      const rentalEndDate = new Date(rental.endDate);
      return (
        (rentalStartDate >= startDate && rentalStartDate <= endDate) ||
        (rentalEndDate >= startDate && rentalEndDate <= endDate) ||
        (rentalStartDate <= startDate && rentalEndDate >= endDate)
      );
    });
  }
  async getPendingRentalsByCarId(carId: string): Promise<RentalData[]> {
    return this.rentals.filter(
      (rental) =>
        rental.carId === carId &&
        rental.status === rentalStatusValidator.enum.pending
    );
  }

  async addRental(rental: RentalData): Promise<void> {
    this.rentals.push(rental);
  }

  async getRentalById(rentalId: string): Promise<RentalData | undefined> {
    return this.rentals.find((rental) => rental.id === rentalId);
  }

  async updateRentalStatus(
    rentalId: string,
    status: RentalStatusType
  ): Promise<void> {
    const rental = this.rentals.find((b) => b.id === rentalId);
    if (rental) {
      rental.status = status;
    }
  }

  async deleteRental(rentalId: string): Promise<void> {
    this.rentals = this.rentals.filter((rental) => rental.id !== rentalId);
  }
}
