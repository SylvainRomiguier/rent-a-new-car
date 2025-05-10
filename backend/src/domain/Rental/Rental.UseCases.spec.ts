import { RentalUseCases } from "./Rental.UseCases";
import { CarUseCases } from "../Car/Car.UseCases";
import { describe, beforeEach, it } from "node:test";
import { InMemoryRentalService } from "../__tests__/RentalService.InMemory";
import { InMemoryCarService } from "../__tests__/CarService.InMemory";
import assert from "node:assert";
import { IPresenter } from "../common/IPresenter";
import { RentalData } from "./Rental";
import { InMemoryCustomerService } from "../__tests__/CustomerService.InMemory";
import { CarDataWithPendingRentals } from "../Car/Car";

describe("Rental Use Cases", () => {
  let useCase: RentalUseCases;
  let carUseCases: CarUseCases;

  class RentalsPresenter implements IPresenter<RentalData[]> {
    presentedValue: RentalData[] = [];
    present(value: RentalData[]): void {
      this.presentedValue = value;
    }
  }

    class CarPresenter implements IPresenter<CarDataWithPendingRentals> {
        presentedValue: CarDataWithPendingRentals | undefined;
        present(value: CarDataWithPendingRentals): void {
        this.presentedValue = value;
        }
    }

  beforeEach(() => {
    const rentalService = new InMemoryRentalService();
    const carService = new InMemoryCarService();
    const customerService = new InMemoryCustomerService();
    useCase = new RentalUseCases(
        rentalService,
        carService,
        customerService
    );
    carUseCases = new CarUseCases(rentalService, carService);

  });

  it("should get all rentals", async () => {
    const startDate = new Date("2023-10-01");
    const endDate = new Date("2023-10-10");

    // get 2 cars from mocked data
    const carId1 = "1dc43148-e72a-4114-8d30-845e0bcc82e0";
    const carId2 = "63bef23a-86ea-4d5e-87c1-91b7e7c496f5";
   
    // get 2 customers from mocked data
    const customerId1 = "123e4567-e89b-12d3-a456-426614174001";
    const customerId2 = "098f6bcd-4621-d373-cade-4e8357e08910";

    // create 2 rentals
    await carUseCases.rentCar(
      carId1,
      customerId1,
      startDate,
      endDate
    );
    await carUseCases.rentCar(
      carId2,
      customerId2,
      startDate,
      endDate
    );

  
    const rentalsPresenter = new RentalsPresenter();
    await useCase.getAllRentalsBetween2Dates(startDate, endDate, rentalsPresenter);
    assert.deepEqual(rentalsPresenter.presentedValue.length, 2);
  });
});
