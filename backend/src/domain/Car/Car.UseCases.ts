import { UUID } from "../common/UUID";
import { CustomerData, Customer } from "../Customer/Customer";
import { IBookingService } from "../IBookingService";
import { ICarService } from "../ICarService";
import { CarData, Car } from "./Car";


export class CarUseCases {
  constructor(
    private bookingService: IBookingService,
    private carService: ICarService,
  ) {}

  async addCar(carData: CarData): Promise<void> {
    const newCar = new Car(carData, this.bookingService);
    await this.carService.addCar(newCar.value);
  }
  async getCarById(carId: string): Promise<Car | undefined> {
    const carData = await this.carService.getCarById(carId);
    if (carData) {
      return new Car(carData, this.bookingService);
    }
    return undefined;
  }
  async getAllCars(): Promise<Car[]> {
    const carDataList = await this.carService.getAllCars();
    return carDataList.map((carData) => new Car(carData, this.bookingService));
  }
  async updateCar(carId: string, carData: CarData): Promise<void> {
    const car = await this.getCarById(carId);
    if (car) {
      const updatedCar = new Car(
        { ...car.value, ...carData },
        this.bookingService
      );
      await this.carService.updateCar(carId, updatedCar.value);
    }
  }
  async deleteCar(carId: string): Promise<void> {
    const car = await this.getCarById(carId);
    if (car) {
      await this.carService.deleteCar(carId);
    }
  }
}
