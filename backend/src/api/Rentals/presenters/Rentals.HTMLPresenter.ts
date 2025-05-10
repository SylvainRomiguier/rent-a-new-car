import Handlebars from "handlebars";
import fs from "fs";
import { RentalData } from "../../../domain/Rental/Rental";
import { IPresenter } from "../../../domain/common/IPresenter";
import path from "path";

export class RentalsHtmlPresenter implements IPresenter<RentalData[]> {
  presentedValue: string = "";
  private html:string;
  constructor() {
    try {
      this.html = fs.readFileSync(
        path.resolve(__dirname, "../../templates/rentalsTable.template.hbs"),
        "utf-8"
      );
    } catch (error) {
      console.error("Error reading template file:", error);
      throw error;
    }
  }
  present(rentals: RentalData[]): void {
    if (!rentals || rentals.length === 0) {
      this.presentedValue = "<h1 id='rentalsTable'>No rentals found</h1>";
      return;
    }
    this.presentedValue = Handlebars.compile(this.html)({
      rentals,
    });
  }
}
