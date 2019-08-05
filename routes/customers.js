const express = require("express");
const router = express.Router();
const Customer = require("../models").Customer;
const Game = require("../models").Game;
const Rental = require("../models").Rental;

/*=======================================================================
// Render all customers upon visiting the All Customers page.
=======================================================================*/
router.get("/", function(req, res, next) {
  Customer.findAll({
    order: [["first_name", "ASC"], ["last_name", "ASC"]]
  }).then(function(customers) {
    res.render("all_customers", { customers, customerStatus: "/customers" });
  });
});

/*=======================================================================
// Render New Customer form upon clicking Create New Customer button.
=======================================================================*/
router.get("/new", function(req, res, next) {
  res.render("new_customer");
});

/*=======================================================================
// Add new customer upon submission. The Customer model will check to make 
// sure all fields meet contraints.
=======================================================================*/
router.post("/new", function(req, res, next) {
  Customer.create(req.body)
    .then(function() {
      res.redirect("/customers");
    })
    .catch(function(error) {
      res.render("new_customer", {
        errors: error.errors,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        address: req.body.address,
        email: req.body.email,
        epic_id: req.body.epic_id,
        zip_code: req.body.zip_code
      });
    });
});

/*=======================================================================
// Get all details for a customer upon clicking on a name.
=======================================================================*/
router.get("/:id", function(req, res, next) {
  let errors = [req.query.errors];
  const foundCustomer = Customer.findById(req.params.id);

  const foundRental = Rental.findAll({
    where: [
      {
        customer_id: req.params.id
      }
    ],
    include: [{ model: Customer }, { model: Game }]
  });

  Promise.all([foundCustomer, foundRental]).then(function(values) {
    res.render("details_customer", {
      customer: values[0],
      rentals: values[1],
      errors: errors
    });
  });
});

/*=======================================================================
// Update details for Customer. If an error is caught, redirect to
// the same page but with an error passed to display the error to
// the user.
=======================================================================*/
router.post("/:id", function(req, res, next) {
  Customer.update(req.body, {
    where: [
      {
        id: req.params.id
      }
    ]
  })
    .then(function() {
      return res.redirect("/customers");
    })
    .catch(errors => {
      const errorMessages = errors.errors.map(err => err.message);
      return res.redirect(
        `/customers/${req.params.id}?errors=${errorMessages}`
      );
    });
});

module.exports = router;
