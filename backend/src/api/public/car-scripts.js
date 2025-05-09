function saveCar() {
  const car = {
    id: document.getElementById("carId").value,
    make: document.getElementById("carMake").value,
    model: document.getElementById("carModel").value,
    year: Number(document.getElementById("carYear").value),
    price: Number(document.getElementById("carPrice").value),
    color: document.getElementById("carColor").value,
    mileage: Number(document.getElementById("carMileage").value),
    energy: document.getElementById("carEnergy").value,
  };
  const method = car.id ? "PUT" : "POST";
  fetch("/cars/html", {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(car),
  })
    .then((response) => response.text())
    .then((carsTable) => {
      const carTable = document.getElementById("carsTable");
      carTable.outerHTML = carsTable;
      document.getElementById("carForm").reset();
      document.getElementById("formButton").innerHTML = "Add Car";
    })
    .catch((error) => {
      console.error("Error saving car:", error);
    });
}
function editCar(car) {
  jsonCar = JSON.parse(car);
  document.getElementById("carMake").value = jsonCar.make;
  document.getElementById("carModel").value = jsonCar.model;
  document.getElementById("carYear").value = jsonCar.year;
  document.getElementById("carPrice").value = jsonCar.price;
  document.getElementById("carColor").value = jsonCar.color;
  document.getElementById("carMileage").value = jsonCar.mileage;
  document.getElementById("carEnergy").value = jsonCar.energy;
  document.getElementById("carId").value = jsonCar.id;
  document.getElementById("formButton").innerHTML = "Update Car";
}
function deleteCar(carId) {
  if (confirm("Are you sure you want to delete this car?")) {
    fetch(`/cars/html/${carId}`, {
      method: "DELETE",
    })
      .then((response) => response.text())
      .then((carsTable) => {
        const carTable = document.getElementById("carsTable");
        carTable.outerHTML = carsTable;
        document.getElementById("carForm").reset();
        document.getElementById("formButton").innerHTML = "Add Car";
      })
      .catch((error) => {
        console.error("Error deleting car:", error);
      });
  }
}
