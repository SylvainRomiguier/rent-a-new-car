import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

const fastify = Fastify({
  logger: true,
});

// Declare static route
fastify.register(fastifyStatic, {
  root: `${__dirname}/../api/public`,
  prefix: "/public/",
});

// Import the routes from the CarsController
import { CarsController } from "../api/Cars/Cars.controller";
import { CarUseCases } from "../domain/Car/Car.UseCases";
import { InMemoryCarService } from "../domain/__tests__/CarService.InMemory";
import { InMemoryBookingService } from "../domain/__tests__/BookingService.InMemory";
import { CarController } from "../api/Car/Car.controller";
import { CustomerUseCases } from "../domain/Customer/Customer.UseCases";
import { InMemoryCustomerService } from "../domain/__tests__/CustomerService.InMemory";
import { CustomersController } from "../api/Customers/Customers.controller";
import { CustomerController } from "../api/Customer/Customer.controller";

// Initialize the use cases and controller
const carUseCases = new CarUseCases(
  new InMemoryBookingService(),
  new InMemoryCarService()
);
const carsController = new CarsController(carUseCases);
const carController = new CarController(carUseCases);
const customerUseCases = new CustomerUseCases(new InMemoryCustomerService());

const customerController = new CustomerController(customerUseCases);
const customersController = new CustomersController(customerUseCases);

// Register the routes
const routes = [
  ...carsController.getFastifyRoutes(),
  ...carController.getFastifyRoutes(),
  ...customersController.getFastifyRoutes(),
  ...customerController.getFastifyRoutes(),
];

routes.forEach((route) => {
  fastify.route({
    method: route.method,
    schema: route.schema,
    url: route.path,
    handler: route.handler,
  });
});

// Declare swagger route
fastify.register(fastifySwagger, {
  openapi: {
    openapi: "3.0.0",
    info: {
      title: "Car booking API",
      description: "API for booking cars",
      version: "0.1.0",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
    tags: [
      { name: "customer", description: "Customer related end-points" },
      { name: "car", description: "Car related end-points" },
      { name: "cars", description: "Cars related end-points" },
    ],
  },
});

fastify.register(fastifySwaggerUi, {
  routePrefix: "/documentation",
  uiConfig: {
    docExpansion: "full",
    deepLinking: false,
  },
});

// Run the server!
const start = async () => {
  try {
    await fastify.listen({ host: "0.0.0.0", port: 3000 });
    fastify.log.info(`Server is running at http://localhost:3000 youpi`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
