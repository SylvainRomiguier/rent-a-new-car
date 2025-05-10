import { RentalData } from "./Rental/Rental";

export interface IRentalService {
  getPendingRentalsByCarId(carId: string): Promise<RentalData[]>;
  addRental(rental: RentalData): Promise<void>;
  getRentalById(rentalId: string): Promise<RentalData | undefined>;
  updateRentalStatus(rentalId: string, status: string): Promise<void>;
  deleteRental(rentalId: string): Promise<void>;
  getRentalsByCustomerId(customerId: string): Promise<RentalData[]>;
  getRentalsByCarId(carId: string): Promise<RentalData[]>;
  getAllRentalsBetween2Dates(startDate:Date, endDate:Date): Promise<RentalData[]>;
}
