const express = require('express');
const moment = require('moment');
const router = express.Router();
const Customer = require('../models').Customer;
const Game = require('../models').Game;
const Rental = require('../models').Rental;

let todaysDate = moment().format("YYYY-MM-DD");
let returnDate = moment(todaysDate).add(7, 'days').format("YYYY-MM-DD");

/*=======================================================================
// Get all game rentals and display them.
=======================================================================*/
router.get('/', function(req, res, next) {
  
  Rental.findAll({
    include: [
      { model: Customer },
      { model: Game }
    ]
  }).then(function(rentals) {
    res.render('all_rentals', { rentals, rentalStatus: '/rentals', title: 'Rentals' });
  });
})

/*=======================================================================
// Get overdue rentals and display them upon clicking the Overdue
// filter.
=======================================================================*/
router.get('/overdue_rentals', function(req, res, next) {

  Rental.findAll({
    where: {
      returned_on: null,
      return_by: {
        lt: todaysDate
      }
    },
    include: [
      { model: Game },
      { model: Customer }
    ]
  }).then(function(rentals) {
    res.render('all_rentals', { rentals, gameStatus: '/rentals/overdue_rentals', title: 'Overdue Rentals' });
  });
})

/*=======================================================================
// Get checked out rentals and display them upon clicking the
// Checked Out filter.
=======================================================================*/
router.get('/checked_rentals', function(req, res, next) {

  Rental.findAll({
    where: {
      returned_on: null,
    },
    include: [
      { model: Game },
      { model: Customer }
    ]
  }).then(function(rentals) {
    res.render('all_rentals', { rentals, gameStatus: '/rentals/checked_rentals', title: 'Checked Out Games' });
  });
})

/*=======================================================================
// Render New Rental form upon clicking Create New Rental.
=======================================================================*/
router.get('/new', function(req, res, next) {
  
  const allGames = Game.findAll({
    order: [
      ['title', 'ASC']
    ]
  });

  const allCustomers = Customer.findAll({
    order: [
      ['first_name', 'ASC'],
      ['last_name', 'ASC']
    ]
  });

  Promise.all([allGames, allCustomers])
    .then(function(values) {
      res.render('new_rental', { games: values[0], customers: values[1], todaysDate, returnDate });
  });
})

/*=======================================================================
// Add a new rental upon clicking Create New Rental on a New Rental form.
// The function will validate submitted data.
=======================================================================*/
router.post('/new', function(req, res, next) {

  Rental.create(req.body)
    .then(function() {
      res.redirect('/rentals');
    })
    .catch(function(error) {
      const allGames = Game.findAll({
        order: [
          ['title', 'ASC']
        ]
    });

  const allCustomers = Customer.findAll({
    order: [
      ['first_name', 'ASC'],
      ['last_name', 'ASC']
    ]
  });

  Promise.all([allGames, allCustomers])
    .then(function(values) {
      res.render('new_rental', { games: values[0], customers: values[1], todaysDate, returnDate, 
        todaysDate: req.body.rented_on, returnDate: req.body.return_by, errors: error.errors });
    })
  });
})

module.exports = router;
