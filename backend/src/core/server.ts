import Fastify from "fastify";

const fastify = Fastify({
  logger: true,
});

// Declare a route
fastify.get("/", function (request, reply) {
  reply.send({ hello: "world" });
});

// Import the routes from the CarsController
import { CarsController } from "../api/Cars/Cars.controller";
import { CarUseCases } from "../domain/Car/Car.UseCases";
import { InMemoryCarService } from "../domain/__tests__/CarService.InMemory";
import { InMemoryBookingService } from "../domain/__tests__/BookingService.InMemory";

// Initialize the use cases and controller
const carUseCases = new CarUseCases(
  new InMemoryBookingService(),
  new InMemoryCarService()
);
const carsController = new CarsController(carUseCases);
// Register the routes
const routes = carsController.getFastifyRoutes();
routes.forEach((route) => {
  fastify.route({
    method: route.method,
    url: route.path,
    handler: route.handler,
  });
});

// Run the server!
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    fastify.log.info(`Server is running at http://localhost:3000 youpi`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
