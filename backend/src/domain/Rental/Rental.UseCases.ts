import { IPresenter } from "../common/IPresenter";
import { ICarService } from "../ICarService";
import { ICustomerService } from "../ICustomerService";
import { IRentalService } from "../IRentalService";
import { CustomDate } from "./CustomDate";
import { RentalData } from "./Rental";

export class RentalUseCases {
  constructor(
    private readonly rentalService: IRentalService,
    private readonly carService: ICarService,
    private readonly customerService: ICustomerService
  ) {}
  async getAllRentalsBetween2Dates(_startDate:Date, _endDate:Date, presenter: IPresenter<RentalData[]>): Promise<void> {
    const startDate = new CustomDate(_startDate);
    const endDate = new CustomDate(_endDate);
    const rentals = await this.rentalService.getAllRentalsBetween2Dates(startDate.value, endDate.value);
    presenter.present(rentals);
  }
}