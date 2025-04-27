import { BookingData } from "./Booking/Booking";

export interface IBookingService {
    getPendingBookingsByCarId(carId: string): Promise<BookingData[]>;
}