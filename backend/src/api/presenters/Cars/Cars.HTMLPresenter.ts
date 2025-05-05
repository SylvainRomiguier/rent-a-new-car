import Handlebars from "handlebars";
import carsTableTemplate from "./carsTable.template.hbs";
import { CarData } from "../../../domain/Car/Car";
import { IPresenter } from "../../../domain/common/IPresenter";

export class CarsHtmlPresenter implements IPresenter<CarData[]> {
  presentedValue: string = "";
  present(cars: CarData[]): void {
    this.presentedValue = Handlebars.compile(carsTableTemplate)({
      cars,
    });
  }
}
