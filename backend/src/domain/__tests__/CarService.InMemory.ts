import { CarData } from "../Car/Car";
import { ICarService } from "../ICarService";
import { carsFixture } from "./cars.fixture";

export class InMemoryCarService implements ICarService {
  private cars: CarData[] = [];

  constructor() {
    this.cars = [...carsFixture];
  }

  async getCarById(carId: string): Promise<CarData | null> {
    return this.cars.find((car) => car.id === carId) || null;
  }

  async getCarsByIds(carIds: string[]): Promise<CarData[]> {
    return this.cars.filter((car) => carIds.includes(car.id!));
  }

  async getCarsByMake(make: string): Promise<CarData[]> {
    return this.cars.filter((car) => car.make === make);
  }

  async getCarsByModel(model: string): Promise<CarData[]> {
    return this.cars.filter((car) => car.model === model);
  }
  async getCarsByYear(year: number): Promise<CarData[]> {
    return this.cars.filter((car) => car.year === year);
  }
  async getCarsByPriceRange(
    minPrice: number,
    maxPrice: number
  ): Promise<CarData[]> {
    return this.cars.filter(
      (car) => car.price >= minPrice && car.price <= maxPrice
    );
  }
  async getAllCars(): Promise<CarData[]> {
    return this.cars;
  }
  async addCar(car: CarData): Promise<void> {
    this.cars.push(car);
  }
  async updateCar(carId: string, car: CarData): Promise<void> {
    const index = this.cars.findIndex((c) => c.id === carId);
    if (index !== -1) {
      this.cars[index] = car;
    }
  }
  async deleteCar(carId: string): Promise<void> {
    this.cars = this.cars.filter((car) => car.id !== carId);
  }
}
