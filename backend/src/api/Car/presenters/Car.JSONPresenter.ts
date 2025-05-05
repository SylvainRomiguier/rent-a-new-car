import { CarData } from "../../../domain/Car/Car";
import { IPresenter } from "../../../domain/common/IPresenter";

export class CarJsonPresenter implements IPresenter<CarData> {
  presentedValue: CarData | undefined;
  present(car: CarData): void {
    this.presentedValue = car;
  }
}
