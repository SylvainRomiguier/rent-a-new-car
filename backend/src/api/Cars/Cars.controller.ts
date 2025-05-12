import { FastifyReply, FastifyRequest } from "fastify";
import { CarUseCases } from "../../domain/Car/Car.UseCases";
import { CarsArrayJsonPresenter } from "./presenters/CarsArray.JSONPresenter";
import { CarsHtmlPresenter } from "./presenters/Cars.HTMLPresenter";
import Handlebars from "handlebars";
import fs from "fs";
import path from "path";
import { energyTypes } from "../../domain/Car/Energy";

Handlebars.registerHelper("json", function (context) {
  return JSON.stringify(context);
});

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
      const content = htmlPresenter.presentedValue;
      const layout = Handlebars.compile(
        fs.readFileSync(
          path.resolve(__dirname, "../templates/layout.template.hbs"),
          "utf-8"
        )
      )({
        title: "Cars",
      });

      const carFormTemplate = fs.readFileSync(
        path.resolve(__dirname, "../templates/carForm.template.hbs"),
        "utf-8"
      );

      const carForm = Handlebars.compile(carFormTemplate)({
        energyTypes,
      });
      res
        .status(200)
        .type("text/html")
        .send(layout.replace("<content />", content.concat(carForm)));
    } catch (error) {
      console.error("Error getting cars in HTML format:", error);
      req.log.error("Error getting cars in HTML format:", error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  }

  async getAvailableCarsToHTML(req: FastifyRequest, res: FastifyReply) {
    try {
      const { startDate, endDate } = req.query as {
        startDate: string;
        endDate: string;
      };
      const htmlPresenter = new CarsHtmlPresenter();
      await this.useCases.getAvailableCarsBetween2Dates(
        new Date(startDate),
        new Date(endDate),
        htmlPresenter
      );
      const content = htmlPresenter.presentedValue;
      const layout = Handlebars.compile(
        fs.readFileSync(
          path.resolve(__dirname, "../templates/layout.template.hbs"),
          "utf-8"
        )
      )({
        title: "Available Cars",
      });

      res
        .status(200)
        .type("text/html")
        .send(layout.replace("<content />", content));
    } catch (error) {
      console.error("Error getting cars in HTML format:", error);
      req.log.error("Error getting cars in HTML format:", error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  }

  getFastifyRoutes() {
    const routes = [
      {
        method: "GET",
        path: "/cars/json",
        schema: {
          tags: ["cars"],
          description: "Get all cars in JSON format",
          response: {
            200: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  make: { type: "string" },
                  model: { type: "string" },
                  year: { type: "number" },
                  color: { type: "string" },
                  price: { type: "number" },
                },
              },
            },
          },
        },
        handler: this.getCarsToJSON.bind(this),
      },
      {
        method: "GET",
        path: "/cars/html",
        schema: {
          tags: ["cars"],
          description: "Get all cars in HTML format",
          response: {
            200: {
              type: "string",
            },
          },
        },
        handler: this.getCarsToHTML.bind(this),
      },
      {
        method: "GET",
        path: "/available-cars/html",
        schema: {
          tags: ["cars"],
          description: "Get available cars in HTML format",
          querystring: {
            type: "object",
            properties: {
              startDate: { type: "string", format: "date" },
              endDate: { type: "string", format: "date" },
            },
            required: ["startDate", "endDate"],
          },
          response: {
            200: {
              type: "string",
            },
          },
        },
        handler: this.getAvailableCarsToHTML.bind(this),
      },
    ];
    return routes;
  }
}
