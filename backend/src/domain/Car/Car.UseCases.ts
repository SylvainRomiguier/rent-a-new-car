import { CustomDate } from "../Rental/CustomDate";
import { IPresenter } from "../common/IPresenter";
import { UUID } from "../common/UUID";
import { IRentalService } from "../IRentalService";
import { ICarService } from "../ICarService";
import {
  CarData,
  Car,
  CarDataWithPendingRentals,
  CarWithPendingRentals,
  CarProperties,
} from "./Car";
import { ICustomerService } from "../ICustomerService";

export class CarUseCases {
  constructor(
    private rentalService: IRentalService,
    private carService: ICarService,
    private customerService: ICustomerService
  ) {}

  async addCar(carData: CarProperties): Promise<void> {
    const newId = new UUID().value;
    const newCarData = { ...carData, id: newId };
    const car = new Car(newCarData);
    await this.carService.addCar(car.value);
  }
  async getCarById(
    carId: string,
    presenter: IPresenter<CarDataWithPendingRentals>
  ): Promise<void> {
    const carData = await this.carService.getCarById(carId);
    if (!carData) {
      throw new Error("Car not found");
    }
    const pendingRentals = await this.rentalService.getPendingRentalsByCarId(
      carData.id
    );
    presenter.present(new CarWithPendingRentals(carData, pendingRentals).value);
  }
  async getAllCars(presenter: IPresenter<CarData[]>): Promise<void> {
    const carDataList = await this.carService.getAllCars();
    presenter.present(carDataList.map((carData) => new Car(carData).value));
  }

  async getAvailableCarsBetween2Dates(
    startDate: Date,
    endDate: Date,
    presenter: IPresenter<CarData[]>
  ): Promise<void> {
    const cars = await this.carService.getAllCars();
    const availableCars = [];
    for (const carData of cars) {
      const pendingRentals = await this.rentalService.getPendingRentalsByCarId(
        carData.id
      );
      const car = new CarWithPendingRentals(carData, pendingRentals);
      if (
        car.isAvailableBetweenDates(
          new CustomDate(startDate),
          new CustomDate(endDate)
        )
      ) {
        availableCars.push(car.value);
      }
    }
    presenter.present(availableCars.map((carData) => new Car(carData).value));
  }

  async updateCar(carId: string, carProperties: CarProperties): Promise<void> {
    const car = await this.carService.getCarById(carId);
    if (!car) {
      throw new Error("Car not found");
    }
    const updatedCar = new Car({ ...car, ...carProperties });
    await this.carService.updateCar(carId, updatedCar.value);
  }
  async deleteCar(carId: string): Promise<void> {
    const carData = await this.carService.getCarById(carId);
    if (!carData) {
      throw new Error("Car not found");
    }
    const car = new Car(carData);
    await this.carService.deleteCar(car.value.id);
  }

  async rentCar(
    carId: string,
    customerId: string,
    startDate: Date,
    endDate: Date
  ): Promise<void> {
    const carData = await this.carService.getCarById(carId);
    if (!carData) {
      throw new Error("Car not found");
    }
    const customerData = await this.customerService.getCustomerById(customerId);
    if (!customerData) {
      throw new Error("Customer not found");
    }
    const pendingRentals = await this.rentalService.getPendingRentalsByCarId(
      carData.id
    );
    const rental = new CarWithPendingRentals(carData, pendingRentals).rent(
      new UUID(customerId),
      new CustomDate(startDate),
      new CustomDate(endDate)
    );
    await this.rentalService.addRental(rental.value);
  }
}
