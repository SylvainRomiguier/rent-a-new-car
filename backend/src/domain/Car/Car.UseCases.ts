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
  carPropertiesValidator,
} from "./Car";

export class CarUseCases {
  constructor(
    private rentalService: IRentalService,
    private carService: ICarService
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
    if (!car.value.id) {
      throw new Error("Car ID is missing");
    }
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
