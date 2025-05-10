import { RentalData } from "../../../domain/Rental/Rental";
import { IPresenter } from "../../../domain/common/IPresenter";

export class RentalsArrayJsonPresenter implements IPresenter<RentalData[]> {
  presentedValue: RentalData[] = [];
  present(rentals: RentalData[]): void {
    this.presentedValue = rentals;
  }
}
