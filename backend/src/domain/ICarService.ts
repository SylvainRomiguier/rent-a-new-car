import { CarData } from "./Car/Car";

export interface ICarService {
    getCarById(carId: string): Promise<CarData | null>;
    getCarsByIds(carIds: string[]): Promise<CarData[]>;
    getCarsByMake(make: string): Promise<CarData[]>;
    getCarsByModel(model: string): Promise<CarData[]>;
    getCarsByYear(year: number): Promise<CarData[]>;
    getCarsByPriceRange(minPrice: number, maxPrice: number): Promise<CarData[]>;
    getAllCars(): Promise<CarData[]>;
    addCar(car: CarData): Promise<void>;
    updateCar(carId: string, car: CarData): Promise<void>;
    deleteCar(carId: string): Promise<void>;
    }