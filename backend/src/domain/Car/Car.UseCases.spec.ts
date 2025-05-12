import { CarUseCases } from "./Car.UseCases";
import { CarData, CarDataWithPendingRentals, CarProperties } from "./Car";
import { describe, beforeEach, it } from "node:test";
import { InMemoryRentalService } from "../__tests__/RentalService.InMemory";
import { InMemoryCarService } from "../__tests__/CarService.InMemory";
import { energyValidator } from "./Energy";
import assert from "node:assert";
import { carsFixture } from "../__tests__/cars.fixture";
import { IPresenter } from "../common/IPresenter";
import { InMemoryCustomerService } from "../__tests__/CustomerService.InMemory";

describe("Car Use Cases", () => {
  let useCase: CarUseCases;
  class CarPresenter implements IPresenter<CarData> {
    presentedValue: CarDataWithPendingRentals | undefined;
    present(value: CarDataWithPendingRentals): void {
      this.presentedValue = value;
    }
  }

  class CarsPresenter implements IPresenter<CarData[]> {
    presentedValue: CarData[] = [];
    present(value: CarData[]): void {
      this.presentedValue = value;
    }
  }
  beforeEach(() => {
    useCase = new CarUseCases(
      new InMemoryRentalService(),
      new InMemoryCarService(),
      new InMemoryCustomerService()
    );
  });

  it("should add car", async () => {
    const newCarData: CarProperties = {
      make: "Test Brand",
      model: "Test Model",
      year: 2023,
      price: 100,
      color: "Red",
      mileage: 0,
      energy: energyValidator.enum.GASOLINE,
    };
    await useCase.addCar(newCarData);
    const carsPresenter = new CarsPresenter();
    await useCase.getAllCars(carsPresenter);
    const { id, ...lastCarAdded } =
      carsPresenter.presentedValue[carsPresenter.presentedValue.length - 1];
    assert.deepEqual(lastCarAdded, newCarData);
  });

  it("should get car by id", async () => {
    const carId = "1dc43148-e72a-4114-8d30-845e0bcc82e0";
    const carPresenter = new CarPresenter();
    await useCase.getCarById(carId, carPresenter);
    assert.deepEqual(carPresenter.presentedValue, {
      id: "1dc43148-e72a-4114-8d30-845e0bcc82e0",
      make: "Tesla",
      model: "3",
      year: 2024,
      color: "White",
      mileage: 5000,
      price: 50,
      energy: energyValidator.enum.ELECTRIC,
      pendingRentals: [],
    });
  });

  it("should get all cars", async () => {
    const carDataList = carsFixture;
    const carsPresenter = new CarsPresenter();
    await useCase.getAllCars(carsPresenter);
    assert.deepEqual(carsPresenter.presentedValue, carDataList);
  });

  it("should update car", async () => {
    const carId = "1dc43148-e72a-4114-8d30-845e0bcc82e0";
    const updatedCarData = {
      make: "Tesla",
      model: "3",
      year: 2024,
      color: "White",
      mileage: 6000,
      price: 50,
      energy: energyValidator.enum.ELECTRIC,
    };
    await useCase.updateCar(carId, updatedCarData);
    const carPresenter = new CarPresenter();
    await useCase.getCarById(carId, carPresenter);
    assert.deepEqual(carPresenter.presentedValue, {
      id: carId,
      make: "Tesla",
      model: "3",
      year: 2024,
      color: "White",
      mileage: 6000,
      price: 50,
      energy: energyValidator.enum.ELECTRIC,
      pendingRentals: [],
    });
  });

  it("should not update car if not found", async () => {
    const carId = "non-existing-id";
    const updatedCarData = {
      make: "Tesla",
      model: "3",
      year: 2024,
      color: "White",
      mileage: 6000,
      price: 50,
      energy: energyValidator.enum.ELECTRIC,
    };
    await assert.rejects(
      () => useCase.updateCar(carId, updatedCarData),
      (err) => {
        assert.strictEqual((err as Error).message, "Car not found");
        return true;
      }
    );
  });
  it("should not delete car if not found", async () => {
    const carId = "non-existing-id";
    await assert.rejects(
      () => useCase.deleteCar(carId),
      (err) => {
        assert.strictEqual((err as Error).message, "Car not found");
        return true;
      }
    );
  });

  it("should delete car", async () => {
    const carId = "1dc43148-e72a-4114-8d30-845e0bcc82e0";
    await useCase.deleteCar(carId);
    const carPresenter = new CarPresenter();
    await assert.rejects(
      () => useCase.getCarById(carId, carPresenter),
      (err) => {
        assert.strictEqual((err as Error).message, "Car not found");
        return true;
      }
    );
  });

  it("should rent car", async () => {
    const carId = "1dc43148-e72a-4114-8d30-845e0bcc82e0";
    const customerId = "123e4567-e89b-12d3-a456-426614174001";
    const startDate = new Date("2025-01-01");
    const endDate = new Date("2025-01-10");
    await useCase.rentCar(carId, customerId, startDate, endDate);
    const carPresenter = new CarPresenter();
    await useCase.getCarById(carId, carPresenter);
    assert.strictEqual(carPresenter.presentedValue?.pendingRentals.length, 1);
  });

  it("should not rent car if already rented", async () => {
    const carId = "1dc43148-e72a-4114-8d30-845e0bcc82e0";
    const customerId = "123e4567-e89b-12d3-a456-426614174001";
    const startDate = new Date("2023-10-01");
    const endDate = new Date("2023-10-10");
    await useCase.rentCar(carId, customerId, startDate, endDate);
    try {
      await useCase.rentCar(carId, customerId, startDate, endDate);
      assert.fail("Expected error not thrown");
    } catch (error) {
      assert.strictEqual(
        (error as Error).message,
        "Car is already rented for the selected dates."
      );
    }
  });

  it("should not rent car if not found", async () => {
    const carId = "non-existing-id";
    const customerId = "123e4567-e89b-12d3-a456-426614174001";
    const startDate = new Date("2023-10-01");
    const endDate = new Date("2023-10-10");
    await assert.rejects(
      () => useCase.rentCar(carId, customerId, startDate, endDate),
      (err) => {
        assert.strictEqual((err as Error).message, "Car not found");
        return true;
      }
    );
  });

  it("should not rent car if customer not found", async () => {
    const carId = "1dc43148-e72a-4114-8d30-845e0bcc82e0";
    const customerId = "non-existing-id";
    const startDate = new Date("2023-10-01");
    const endDate = new Date("2023-10-10");
    await assert.rejects(
      () => useCase.rentCar(carId, customerId, startDate, endDate),
      (err) => {
        assert.strictEqual((err as Error).message, "Customer not found");
        return true;
      }
    );
  });

  it("should get available cars", async () => {
    const startDate = new Date("2023-10-01");
    const endDate = new Date("2023-10-10");
    await useCase.rentCar(
      "20203fef-4854-4abc-8153-67615f315b7e",
      "123e4567-e89b-12d3-a456-426614174001",
      startDate,
      endDate
    );
    await useCase.rentCar(
      "63bef23a-86ea-4d5e-87c1-91b7e7c496f5",
      "123e4567-e89b-12d3-a456-426614174001",
      startDate,
      endDate
    );
    const carsPresenter = new CarsPresenter();
    await useCase.getAvailableCarsBetween2Dates(
      startDate,
      endDate,
      carsPresenter
    );
    await useCase.getAvailableCarsBetween2Dates(
      startDate,
      endDate,
      carsPresenter
    );

    assert.strictEqual(carsPresenter.presentedValue.length, 1);
    assert.deepEqual(carsPresenter.presentedValue[0], {
      id: "1dc43148-e72a-4114-8d30-845e0bcc82e0",
      make: "Tesla",
      model: "3",
      year: 2024,
      color: "White",
      mileage: 5000,
      price: 50,
      energy: energyValidator.enum.ELECTRIC,
    });
  });
});
