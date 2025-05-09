function saveCustomer() {
  const customer = {
    id: document.getElementById("customerId").value,
    firstName: document.getElementById("customerFirstName").value,
    lastName: document.getElementById("customerLastName").value,
    email: document.getElementById("customerEmail").value,
    phone: document.getElementById("customerPhone").value,
    address: {
      street: document.getElementById("customerStreet").value,
      city: document.getElementById("customerCity").value,
      postalCode: document.getElementById("customerPostalCode").value,
      country: document.getElementById("customerCountry").value,
    }
  };
  const method = customer.id ? "PUT" : "POST";
  fetch("/customers/html", {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(customer),
  })
    .then((response) => response.text())
    .then((customersTable) => {
      const customerTable = document.getElementById("customersTable");
      customerTable.outerHTML = customersTable;
      document.getElementById("customerForm").reset();
      document.getElementById("formButton").innerHTML = "Add Customer";
    })
    .catch((error) => {
      console.error("Error saving customer:", error);
    });
}
function editCustomer(customer) {
  jsonCustomer = JSON.parse(customer);
  document.getElementById("customerFirstName").value = jsonCustomer.firstName;
  document.getElementById("customerLastName").value = jsonCustomer.lastName;
  document.getElementById("customerEmail").value = jsonCustomer.email;
  document.getElementById("customerPhone").value = jsonCustomer.phone;
  document.getElementById("customerStreet").value = jsonCustomer.address.street;
  document.getElementById("customerCity").value = jsonCustomer.address.city;
  document.getElementById("customerPostalCode").value = jsonCustomer.address.postalCode;
  document.getElementById("customerCountry").value = jsonCustomer.address.country;
  document.getElementById("customerId").value = jsonCustomer.id;
  document.getElementById("formButton").innerHTML = "Update Customer";
}
function deleteCustomer(customerId) {
  if (confirm("Are you sure you want to delete this customer?")) {
    fetch(`/customers/html/${customerId}`, {
      method: "DELETE",
    })
      .then((response) => response.text())
      .then((customersTable) => {
        const customerTable = document.getElementById("customersTable");
        customerTable.outerHTML = customersTable;
        document.getElementById("customerForm").reset();
        document.getElementById("formButton").innerHTML = "Add Customer";
      })
      .catch((error) => {
        console.error("Error deleting customer:", error);
      });
  }
}
