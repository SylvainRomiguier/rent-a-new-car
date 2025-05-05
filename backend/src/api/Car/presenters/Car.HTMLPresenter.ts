import Handlebars from "handlebars";
import carsTableTemplate from "../../templates/carsTable.template.hbs";
import { CarDataWithPendingBookings } from "../../../domain/Car/Car";
import { IPresenter } from "../../../domain/common/IPresenter";

export class CarHtmlPresenter
  implements IPresenter<CarDataWithPendingBookings>
{
  presentedValue: string = "";
  present(car: CarDataWithPendingBookings): void {
    this.presentedValue = Handlebars.compile(carsTableTemplate)(car);
  }
}
