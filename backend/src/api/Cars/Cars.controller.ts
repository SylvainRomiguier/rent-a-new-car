import { FastifyReply, FastifyRequest } from "fastify";
import { CarUseCases } from "../../domain/Car/Car.UseCases";
import { CarsArrayJsonPresenter } from "./presenters/CarsArray.JSONPresenter";
import { CarsHtmlPresenter } from "./presenters/Cars.HTMLPresenter";

export class CarsController {
  constructor(private readonly useCases: CarUseCases) {}

  async getCarsToJSON(req: FastifyRequest, res: FastifyReply) {
    try {
      const jsonPresenter = new CarsArrayJsonPresenter();
      await this.useCases.getAllCars(jsonPresenter);
      const cars = jsonPresenter.presentedValue;
      if (!cars || cars.length === 0) {
        return res.status(404).send({ error: "No cars found" });
      }
      res.status(200).send(cars);
    } catch (error) {
      res.status(500).send({ error: "Internal Server Error" });
    }
  }

  async getCarsToHTML(req: FastifyRequest, res: FastifyReply) {
    try {
      const htmlPresenter = new CarsHtmlPresenter();
      await this.useCases.getAllCars(htmlPresenter);
      const cars = htmlPresenter.presentedValue;
      if (!cars || cars.length === 0) {
        return res.status(404).send({ error: "No cars found" });
      }
      res.status(200).type("text/html").send(cars);
    } catch (error) {
      res.status(500).send({ error: "Internal Server Error" });
    }
  }

  getFastifyRoutes() {
    const routes = [
      {
        method: "GET",
        path: "/cars/json",
        handler: this.getCarsToJSON.bind(this),
      },
      {
        method: "GET",
        path: "/cars/html",
        handler: this.getCarsToHTML.bind(this),
      },
    ];
    return routes;
  }
}