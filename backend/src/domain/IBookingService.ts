import { BookingData } from "./Booking/Booking";

export interface IBookingService {
    getPendingBookingsByCarId(carId: string): Promise<BookingData[]>;
    addBooking(booking: BookingData): Promise<void>;
    getBookingById(bookingId: string): Promise<BookingData | undefined>;
    updateBookingStatus(bookingId: string, status: string): Promise<void>;
    deleteBooking(bookingId: string): Promise<void>;
    getBookingsByCustomerId(customerId: string): Promise<BookingData[]>;
    getBookingsByCarId(carId: string): Promise<BookingData[]>;
    getAllBookings(): Promise<BookingData[]>;
}