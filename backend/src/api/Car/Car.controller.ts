import { FastifyReply, FastifyRequest } from "fastify";
import { CarUseCases } from "../../domain/Car/Car.UseCases";
import { CarsHtmlPresenter } from "../Cars/presenters/Cars.HTMLPresenter";
import { carPropertiesValidator, carValidator } from "../../domain/Car/Car";
import path from "path";

export class CarController {
  constructor(private readonly useCases: CarUseCases) {}

  async addCarHTML(req: FastifyRequest, res: FastifyReply) {
    try {
      const htmlPresenter = new CarsHtmlPresenter();
      const validatedCar = carPropertiesValidator.parse(req.body);
      await this.useCases.addCar(validatedCar);
      await this.useCases.getAllCars(htmlPresenter);
      const cars = htmlPresenter.presentedValue;
      res.status(200).type("text/html").send(cars);
    } catch (error) {
      console.error("Error adding car:", error);
      req.log.error("Error adding car:", error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  }

  async updateCarHTML(req: FastifyRequest, res: FastifyReply) {
    try {
      const htmlPresenter = new CarsHtmlPresenter();
      const validatedCar = carValidator.parse(req.body);
      await this.useCases.updateCar(validatedCar.id, validatedCar);
      await this.useCases.getAllCars(htmlPresenter);
      const cars = htmlPresenter.presentedValue;
      res.status(200).type("text/html").send(cars);
    } catch (error) {
      console.error("Error updating car:", error);
      req.log.error("Error updating car:", error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  }

  async deleteCarHTML(req: FastifyRequest, res: FastifyReply) {
    try {
      const params = req.params as { id: string };
      if (!params.id) {
        return res.status(400).send({ error: "Car ID is required" });
      }
      const carId = params.id;
      await this.useCases.deleteCar(carId);
      const htmlPresenter = new CarsHtmlPresenter();
      await this.useCases.getAllCars(htmlPresenter);
      const cars = htmlPresenter.presentedValue;
      res.status(200).type("text/html").send(cars);
    } catch (error) {
      console.error("Error deleting car:", error);
      req.log.error("Error deleting car:", error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  }

  getFastifyRoutes() {
    const routes = [
      {
        method: "POST",
        path: "/cars/html",
        schema: {
          tags: ["cars"],
          description: "Add a new car and get all cars in HTML format",
          body: {
            type: "object",
            properties: {
              make: { type: "string" },
              model: { type: "string" },
              year: { type: "number" },
              color: { type: "string" },
              price: { type: "number" },
              mileage: { type: "number" },
              energy: { type: "string" },
            },
            required: ["make", "model", "year", "color", "price", "mileage", "energy"],
          },
          response: {
            200: {
              type: "string",
            },
          },
        },
        handler: this.addCarHTML.bind(this),
      },
      {
        method: "PUT",
        path: "/cars/html",
        schema: {
          tags: ["cars"],
          description: "Update a car and get all cars in HTML format",
          body: {
            type: "object",
            properties: {
              id: { type: "string" },
              make: { type: "string" },
              model: { type: "string" },
              year: { type: "number" },
              color: { type: "string" },
              price: { type: "number" },
              mileage: { type: "number" },
              energy: { type: "string" },
            },
            required: ["make", "model", "year", "color", "price", "id", "mileage", "energy"],
          },
          response: {
            200: {
              type: "string",
            },
          },
        },
        handler: this.updateCarHTML.bind(this),
      },
      {
        method: "DELETE",
        path: "/cars/html/:id",
        schema: {
          tags: ["cars"],
          description: "Delete a car and get all cars in HTML format",
          params: {
            type: "object",
            properties: {
              id: { type: "string" },
            },
            required: ["id"],
          },
          response: {
            200: {
              type: "string",
            },
          },
        },
        handler: this.deleteCarHTML.bind(this),
      },
    ];
    return routes;
  }
}