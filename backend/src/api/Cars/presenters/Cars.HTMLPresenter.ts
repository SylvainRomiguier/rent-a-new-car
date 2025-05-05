import Handlebars from "handlebars";
import fs from "fs";
import { CarData } from "../../../domain/Car/Car";
import { IPresenter } from "../../../domain/common/IPresenter";
import path from "path";

export class CarsHtmlPresenter implements IPresenter<CarData[]> {
  presentedValue: string = "";
  private carsTableTemplate: string = "";
  private html:string;
  constructor() {
    try {
      
      this.carsTableTemplate = fs.readFileSync(
        path.resolve(__dirname, "../../templates/carsTable.template.hbs"),
        "utf-8"
      );
      this.html = fs.readFileSync(path.resolve(__dirname, "../../templates/layout.template.hbs"), "utf-8");
    } catch (error) {
      console.error("Error reading template file:", error);
      throw error;
    }
  }
  present(cars: CarData[]): void {
    this.html = this.html.replace("{{ content }}", this.carsTableTemplate);
    this.presentedValue = Handlebars.compile(this.html)({
      title: "Cars",
      cars,
    });
  }
}
