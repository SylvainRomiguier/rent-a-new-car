import { CarData } from "../Car/Car";
import { energyValidator } from "../Car/Energy";

export const carsFixture: CarData[] = [
  {
    id: "20203fef-4854-4abc-8153-67615f315b7e",
    make: "Toyota",
    model: "Corolla",
    year: 2020,
    color: "Red",
    mileage: 50,
    price: 60,
    energy: energyValidator.enum.GASOLINE,
  },
  {
    id: "63bef23a-86ea-4d5e-87c1-91b7e7c496f5",
    make: "Honda",
    model: "Civic",
    year: 2019,
    color: "Blue",
    mileage: 2000,
    price: 45,
    energy: energyValidator.enum.DIESEL,
  },
  {
    id: "1dc43148-e72a-4114-8d30-845e0bcc82e0",
    make: "Tesla",
    model: "3",
    year: 2024,
    color: "White",
    mileage: 5000,
    price: 50,
    energy: energyValidator.enum.ELECTRIC,
  },
];
