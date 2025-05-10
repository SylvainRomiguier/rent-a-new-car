import { FastifyReply, FastifyRequest } from "fastify";
import { RentalUseCases } from "../../domain/Rental/Rental.UseCases";
import { RentalsArrayJsonPresenter } from "./presenters/Rentals.JSONPresenter";
import { RentalsHtmlPresenter } from "./presenters/Rentals.HTMLPresenter";
import Handlebars from "handlebars";
import fs from "fs";
import path from "path";

Handlebars.registerHelper("json", function (context) {
  return JSON.stringify(context);
});

export class RentalsController {
  constructor(private readonly useCases: RentalUseCases) {}

  async getRentalsToJSON(req: FastifyRequest, res: FastifyReply) {
    try {
      const jsonPresenter = new RentalsArrayJsonPresenter();
      await this.useCases.getAllRentalsBetween2Dates(
        new Date("2020-01-01"),
        new Date("2020-12-31"),
        jsonPresenter
      );
      const rentals = jsonPresenter.presentedValue;
      if (!rentals || rentals.length === 0) {
        return res.status(404).send({ error: "No rentals found" });
      }
      res.status(200).send(rentals);
    } catch (error) {
      res.status(500).send({ error: "Internal Server Error" });
    }
  }

  async getRentalsToHTML(req: FastifyRequest, res: FastifyReply) {
    try {
      const htmlPresenter = new RentalsHtmlPresenter();
      await this.useCases.getAllRentalsBetween2Dates(
        new Date("2020-01-01"),
        new Date("2020-12-31"),
        htmlPresenter
      );
      const content = htmlPresenter.presentedValue;
      const layout = Handlebars.compile(
        fs.readFileSync(
          path.resolve(__dirname, "../templates/layout.template.hbs"),
          "utf-8"
        )
      )({
        title: "Rentals",
      });

      res
        .status(200)
        .type("text/html")
        .send(layout.replace("<content />", content));
    } catch (error) {
      console.error("Error getting rentals in HTML format:", error);
      req.log.error("Error getting rentals in HTML format:", error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  }

  getFastifyRoutes() {
    const routes = [
      {
        method: "GET",
        path: "/rentals/json",
        schema: {
          tags: ["rentals"],
          description: "Get all rentals in JSON format",
          response: {
            200: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  firstName: { type: "string" },
                  lastName: { type: "string" },
                  email: { type: "number" },
                  phone: { type: "string" },
                  address: {
                    type: "object",
                    properties: {
                      street: { type: "string" },
                      city: { type: "string" },
                      postalCode: { type: "string" },
                      country: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        },
        handler: this.getRentalsToJSON.bind(this),
      },
      {
        method: "GET",
        path: "/rentals/html",
        schema: {
          tags: ["rentals"],
          description: "Get all rentals in HTML format",
          response: {
            200: {
              type: "string",
            },
          },
        },
        handler: this.getRentalsToHTML.bind(this),
      },
    ];
    return routes;
  }
}
