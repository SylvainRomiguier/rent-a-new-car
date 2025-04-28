import { Car, CarData } from "./Car/Car";
import { UUID } from "./common/UUID";
import { Customer, CustomerData } from "./Customer/Customer";
import { IBookingService } from "./IBookingService";
import { ICarService } from "./ICarService";
import { ICustomerService } from "./ICustomerService";

export class UseCases {
  constructor(
    private bookingService: IBookingService,
    private carService: ICarService,
    private customerService: ICustomerService
  ) {}

  // --------------------- Car Use Cases ---------------------
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

  // --------------------- Customer Use Cases ---------------------
  async addCustomer(customerData: CustomerData): Promise<void> {
    const newCustomer = new Customer(customerData);
    await this.customerService.addCustomer(newCustomer.value);
  }

  async getCustomerById(customerId: string): Promise<Customer | undefined> {
    const id  = new UUID(customerId);
    const customerData = await this.customerService.getCustomerById(id.value);
    if (customerData) {
      return new Customer(customerData);
    }
    return undefined;
  }

  async getAllCustomers(): Promise<Customer[]> {
    const customerDataList = await this.customerService.getAllCustomers();
    return customerDataList.map((customerData) => new Customer(customerData));
  }

  async updateCustomer(customerId: string, customerData: CustomerData): Promise<void> {
    const id = new UUID(customerId);
    const customer = await this.getCustomerById(id.value);
    if (customer) {
      const updatedCustomer = new Customer(
        { ...customer.value, ...customerData }
      );
      await this.customerService.updateCustomer(id.value, updatedCustomer.value);
    }
  }

  async deleteCustomer(customerId: string): Promise<void> {
    const id = new UUID(customerId);
    const customer = await this.getCustomerById(id.value);
    if (customer) {
      await this.customerService.deleteCustomer(id.value);
    }
  }
  
}
