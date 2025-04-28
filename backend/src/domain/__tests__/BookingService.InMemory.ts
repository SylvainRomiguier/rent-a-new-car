import { BookingData } from "../Booking/Booking";
import { BookingStatusType, bookingStatusValidator } from "../Booking/BookingStatus";
import { IBookingService } from "../IBookingService";

export class InMemoryBookingService implements IBookingService {
  async getBookingsByCustomerId(customerId: string): Promise<BookingData[]> {
    return this.bookings.filter((booking) => booking.customerId === customerId);
  }
  async getBookingsByCarId(carId: string): Promise<BookingData[]> {
    return this.bookings.filter((booking) => booking.carId === carId);
  }
  async getAllBookings(): Promise<BookingData[]> {
    return this.bookings;
  }
  async getPendingBookingsByCarId(carId: string): Promise<BookingData[]> {
    return this.bookings.filter(
      (booking) => booking.carId === carId && booking.status === bookingStatusValidator.enum.pending
    );
  }

  async addBooking(booking: BookingData): Promise<void> {
    this.bookings.push(booking);
  }

  async getBookingById(bookingId: string): Promise<BookingData | undefined> {
    return this.bookings.find((booking) => booking.id === bookingId);
  }

  async updateBookingStatus(
    bookingId: string,
    status: BookingStatusType
  ): Promise<void> {
    const booking = this.bookings.find((b) => b.id === bookingId);
    if (booking) {
      booking.status = status;
    }
  }

  async deleteBooking(bookingId: string): Promise<void> {
    this.bookings = this.bookings.filter((booking) => booking.id !== bookingId);
  }
  private bookings: BookingData[] = [];
}
