import { FastifyReply, FastifyRequest } from "fastify";
import { CustomerUseCases } from "../../domain/Customer/Customer.UseCases";
import { CustomersHtmlPresenter } from "../Customers/presenters/Customers.HTMLPresenter";
import {
  customerPropertiesValidator,
  customerValidator,
} from "../../domain/Customer/Customer";
import path from "path";

export class CustomerController {
  constructor(private readonly useCases: CustomerUseCases) {}

  async addCustomerHTML(req: FastifyRequest, res: FastifyReply) {
    try {
      const htmlPresenter = new CustomersHtmlPresenter();
      const validatedCustomer = customerPropertiesValidator.parse(req.body);
      await this.useCases.addCustomer(validatedCustomer);
      await this.useCases.getAllCustomers(htmlPresenter);
      const customers = htmlPresenter.presentedValue;
      res.status(200).type("text/html").send(customers);
    } catch (error) {
      console.error("Error adding customer:", error);
      req.log.error("Error adding customer:", error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  }

  async updateCustomerHTML(req: FastifyRequest, res: FastifyReply) {
    try {
      const htmlPresenter = new CustomersHtmlPresenter();
      const validatedCustomer = customerValidator.parse(req.body);
      await this.useCases.updateCustomer(
        validatedCustomer.id,
        validatedCustomer
      );
      await this.useCases.getAllCustomers(htmlPresenter);
      const customers = htmlPresenter.presentedValue;
      res.status(200).type("text/html").send(customers);
    } catch (error) {
      console.error("Error updating customer:", error);
      req.log.error("Error updating customer:", error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  }

  async deleteCustomerHTML(req: FastifyRequest, res: FastifyReply) {
    try {
      const params = req.params as { id: string };
      if (!params.id) {
        return res.status(400).send({ error: "Customer ID is required" });
      }
      const customerId = params.id;
      await this.useCases.deleteCustomer(customerId);
      const htmlPresenter = new CustomersHtmlPresenter();
      await this.useCases.getAllCustomers(htmlPresenter);
      const customers = htmlPresenter.presentedValue;
      res.status(200).type("text/html").send(customers);
    } catch (error) {
      console.error("Error deleting customer:", error);
      req.log.error("Error deleting customer:", error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  }

  getFastifyRoutes() {
    const routes = [
      {
        method: "POST",
        path: "/customers/html",
        schema: {
          tags: ["customers"],
          description:
            "Add a new customer and get all customers in HTML format",
          body: {
            type: "object",
            properties: {
              id: { type: "string" },
              firstName: { type: "string" },
              lastName: { type: "string" },
              email: { type: "string" },
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
            required: [
              "id",
              "firstName",
              "lastName",
              "email",
              "phone",
              "address",
            ],
          },
          response: {
            200: {
              type: "string",
            },
          },
        },
        handler: this.addCustomerHTML.bind(this),
      },
      {
        method: "PUT",
        path: "/customers/html",
        schema: {
          tags: ["customers"],
          description: "Update a customer and get all customers in HTML format",
          body: {
            type: "object",
            properties: {
              id: { type: "string" },
              firstName: { type: "string" },
              lastName: { type: "string" },
              email: { type: "string" },
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
            required: [
              "id",
              "firstName",
              "lastName",
              "email",
              "phone",
              "address",
            ],
          },
          response: {
            200: {
              type: "string",
            },
          },
        },
        handler: this.updateCustomerHTML.bind(this),
      },
      {
        method: "DELETE",
        path: "/customers/html/:id",
        schema: {
          tags: ["customers"],
          description: "Delete a customer and get all customers in HTML format",
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
        handler: this.deleteCustomerHTML.bind(this),
      },
    ];
    return routes;
  }
}
