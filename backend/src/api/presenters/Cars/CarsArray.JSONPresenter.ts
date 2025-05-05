import { CarData } from "../../../domain/Car/Car";
import { IPresenter } from "../../../domain/common/IPresenter";

export class CarsArrayJsonPresenter implements IPresenter<CarData[]> {
  presentedValue: CarData[] = [];
  present(cars: CarData[]): void {
    this.presentedValue = cars;
  }
}
