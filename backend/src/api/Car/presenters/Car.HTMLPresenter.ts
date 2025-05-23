import Handlebars from "handlebars";
import { CarDataWithPendingRentals } from "../../../domain/Car/Car";
import { IPresenter } from "../../../domain/common/IPresenter";
import path from "path";
import fs from "fs";

export class CarHtmlPresenter implements IPresenter<CarDataWithPendingRentals> {
  presentedValue: string = "";
  private html: string;
  constructor() {
    try {
      this.html = fs.readFileSync(
        path.resolve(__dirname, "../../templates/carDetails.template.hbs"),
        "utf-8"
      );
    } catch (error) {
      console.error("Error reading template file:", error);
      throw error;
    }
  }

  present(car: CarDataWithPendingRentals): void {
    this.presentedValue = Handlebars.compile(this.html)(car);
  }
}
