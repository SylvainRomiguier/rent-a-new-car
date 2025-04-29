import { CarUseCases } from "./Car.UseCases";
import { CarData } from "./Car";
import { describe, beforeEach, it } from "node:test";
import { InMemoryBookingService } from "../__tests__/BookingService.InMemory";
import { InMemoryCarService } from "../__tests__/CarService.InMemory";
import { InMemoryCustomerService } from "../__tests__/CustomerService.InMemory";
import { energyValidator } from "./Energy";
import assert from "node:assert";
import { carsFixture } from "../__tests__/cars.fixture";

describe("Use Cases", () => {
  let useCase: CarUseCases;
  beforeEach(() => {
    useCase = new CarUseCases(
      new InMemoryBookingService(),
      new InMemoryCarService()
    );
  });

  it("should add car", async () => {
    const carData: CarData = {
      make: "Test Brand",
      model: "Test Model",
      year: 2023,
      price: 100,
      color: "Red",
      mileage: 0,
      energy: energyValidator.enum.GASOLINE,
    };
    await useCase.addCar(carData);
    const cars = await useCase.getAllCars();
    const { id, ...lastCarAdded } = cars[cars.length - 1].value;

    assert.deepEqual(lastCarAdded, carData);
  });

  it("should get car by id", async () => {
    const carId = "1dc43148-e72a-4114-8d30-845e0bcc82e0";
    const car = await useCase.getCarById(carId);
    assert.deepEqual(car?.value, {
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

  it("should get all cars", async () => {
    const carDataList = carsFixture;
    const cars = await useCase.getAllCars();
    assert.deepEqual(
      cars.map((car) => car.value),
      carDataList
    );
  });

  it("should update car", async () => {
    const carId = "a3de1c07-b312-485b-91aa-89c73bb7879d";
    const carData = {
      id: carId,
      make: "Test Brand",
      model: "Test Model",
      year: 2023,
      price: 100,
      color: "Red",
      mileage: 0,
      energy: energyValidator.enum.GASOLINE,
    };
    await useCase.addCar(carData);
    const updatedCarData = {
      make: "Test Brand",
      model: "Test Model",
      year: 2023,
      price: 100,
      color: "Blue",
      mileage: 0,
      energy: energyValidator.enum.GASOLINE,
    };
    await useCase.updateCar(carId, updatedCarData);
    const car = await useCase.getCarById(carId);
    assert.deepEqual(car?.value, {
      id: carId,
      make: "Test Brand",
      model: "Test Model",
      year: 2023,
      price: 100,
      color: "Blue",
      mileage: 0,
      energy: energyValidator.enum.GASOLINE,
    });
  });

  it("should delete car", async () => {
    const carId = "2dbaedcd-d652-4467-8ec2-e9e0fd685e2a";
    const carData = {
      id: carId,
      make: "Test Brand",
      model: "Model to delete",
      year: 2023,
      price: 100,
      color: "Red",
      mileage: 0,
      energy: energyValidator.enum.ELECTRIC,
    };
    await useCase.addCar(carData);
    await useCase.deleteCar(carId);
    const car = await useCase.getCarById(carId);
    assert.strictEqual(car, undefined);
  });
});
