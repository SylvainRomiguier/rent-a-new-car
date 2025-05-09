import Handlebars from "handlebars";
import fs from "fs";
import { CustomerData } from "../../../domain/Customer/Customer";
import { IPresenter } from "../../../domain/common/IPresenter";
import path from "path";

export class CustomersHtmlPresenter implements IPresenter<CustomerData[]> {
  presentedValue: string = "";
  private html:string;
  constructor() {
    try {
      this.html = fs.readFileSync(
        path.resolve(__dirname, "../../templates/customersTable.template.hbs"),
        "utf-8"
      );
    } catch (error) {
      console.error("Error reading template file:", error);
      throw error;
    }
  }
  present(customers: CustomerData[]): void {
    if (!customers || customers.length === 0) {
      this.presentedValue = "<h1 id='customersTable'>No customers found</h1>";
      return;
    }
    this.presentedValue = Handlebars.compile(this.html)({
      customers,
    });
  }
}
