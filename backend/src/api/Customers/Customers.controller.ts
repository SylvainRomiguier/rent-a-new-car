import { FastifyReply, FastifyRequest } from "fastify";
import { CustomerUseCases } from "../../domain/Customer/Customer.UseCases";
import { CustomersArrayJsonPresenter } from "./presenters/Customers.JSONPresenter";
import { CustomersHtmlPresenter } from "./presenters/Customers.HTMLPresenter";
import Handlebars from "handlebars";
import fs from "fs";
import path from "path";

Handlebars.registerHelper("json", function (context) {
  return JSON.stringify(context);
});

export class CustomersController {
  constructor(private readonly useCases: CustomerUseCases) {}

  async getCustomersToJSON(req: FastifyRequest, res: FastifyReply) {
    try {
      const jsonPresenter = new CustomersArrayJsonPresenter();
      await this.useCases.getAllCustomers(jsonPresenter);
      const customers = jsonPresenter.presentedValue;
      if (!customers || customers.length === 0) {
        return res.status(404).send({ error: "No customers found" });
      }
      res.status(200).send(customers);
    } catch (error) {
      res.status(500).send({ error: "Internal Server Error" });
    }
  }

  async getCustomersToHTML(req: FastifyRequest, res: FastifyReply) {
    try {
      const htmlPresenter = new CustomersHtmlPresenter();
      await this.useCases.getAllCustomers(htmlPresenter);
      const content = htmlPresenter.presentedValue;
      const layout = Handlebars.compile(
        fs.readFileSync(
          path.resolve(__dirname, "../templates/layout.template.hbs"),
          "utf-8"
        )
      )({
        title: "Customers",
      });

      const customerFormTemplate = fs.readFileSync(
        path.resolve(__dirname, "../templates/customerForm.template.hbs"),
        "utf-8"
      );

      const customerForm = Handlebars.compile(customerFormTemplate)({});
      res
        .status(200)
        .type("text/html")
        .send(layout.replace("<content />", content.concat(customerForm)));
    } catch (error) {
      console.error("Error getting customers in HTML format:", error);
      req.log.error("Error getting customers in HTML format:", error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  }

  getFastifyRoutes() {
    const routes = [
      {
        method: "GET",
        path: "/customers/json",
        schema: {
          tags: ["customers"],
          description: "Get all customers in JSON format",
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
        handler: this.getCustomersToJSON.bind(this),
      },
      {
        method: "GET",
        path: "/customers/html",
        schema: {
          tags: ["customers"],
          description: "Get all customers in HTML format",
          response: {
            200: {
              type: "string",
            },
          },
        },
        handler: this.getCustomersToHTML.bind(this),
      },
    ];
    return routes;
  }
}
