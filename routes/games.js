const express = require("express");
const moment = require("moment");
const router = express.Router();
const Customer = require("../models").Customer;
const Game = require("../models").Game;
const Rental = require("../models").Rental;

let todaysDate = moment().format("YYYY-MM-DD");

/*=======================================================================
// Get all games and list them upon visiting the All Games page.
=======================================================================*/
router.get("/", function(req, res, next) {
  Game.findAll({
    order: [["title", "ASC"]]
  }).then(function(games) {
    res.render("all_games", { games, title: "Games" });
  });
});

/*=======================================================================
// Get overdue games and display them when Overdue filter is selected.
=======================================================================*/
router.get("/overdue_games", function(req, res, next) {
  Game.findAll({
    order: [["title", "ASC"]],
    include: [
      {
        model: Rental,
        where: {
          returned_on: null,
          return_by: {
            lt: todaysDate
          }
        }
      }
    ]
  }).then(function(games) {
    res.render("all_games", { games, title: "Overdue Games" });
  });
});

/*=======================================================================
// Get checked out games and display them when Checked Out filter 
// is selected.
=======================================================================*/
router.get("/checked_games", function(req, res, next) {
  Game.findAll({
    order: [["title", "ASC"]],
    include: [
      {
        model: Rental,
        where: {
          returned_on: null
        }
      }
    ]
  }).then(function(games) {
    res.render("all_games", { games, title: "Checked Out Games" });
  });
});

/*=======================================================================
// Render New Game form upon clicking Create New Game button.
=======================================================================*/
router.get("/new", function(req, res, next) {
  res.render("new_game");
});

/*=======================================================================
// Add game to game list from New Game form. If an error is caught,
// redisplay New Game form with entered properties and display
// error message.
=======================================================================*/
router.post("/new", function(req, res, next) {
  Game.create(req.body)
    .then(function() {
      res.redirect("/games");
    })
    .catch(function(error) {
      res.render("new_game", {
        errors: error.errors,
        title: req.body.title,
        genre: req.body.genre,
        developer: req.body.developer,
        first_published: req.body.first_published
      });
    });
});

/*=======================================================================
// Upon visiting a specific game page, get game details based on ID 
// and display the details.
=======================================================================*/
router.get("/:id", function(req, res, next) {
  let errors = [req.query.errors];
  const foundGame = Game.findById(req.params.id);

  const foundRental = Rental.findAll({
    where: [
      {
        game_id: req.params.id
      }
    ],
    include: [{ model: Customer }, { model: Game }]
  });

  Promise.all([foundGame, foundRental]).then(function(values) {
    res.render("details_game", {
      game: values[0],
      rentals: values[1],
      errors: errors
    });
  });
});

/*=======================================================================
// Update game details. If error occurs, display same page with
// error messages. The error message for this function has the
// error messages mapped, reformatted, and pushed to a query
// string due to the POST and URL ID utilization.
=======================================================================*/
router.post("/:id", function(req, res, next) {
  Game.update(req.body, {
    where: [
      {
        id: req.params.id
      }
    ]
  })
    .then(function() {
      return res.redirect("/games");
    })
    .catch(errors => {
      const errorMessages = errors.errors.map(err => err.message);
      return res.redirect(`/games/${req.params.id}?errors=${errorMessages}`);
    });
});

/*=======================================================================
// Get return game page upon clicking Return Game.
=======================================================================*/
router.get("/:id/return", function(req, res, next) {
  Rental.findAll({
    where: [
      {
        game_id: req.params.id
      }
    ],
    include: [{ model: Customer }, { model: Game }]
  }).then(function(rentals) {
    res.render("return_game", { rental: rentals[0], todaysDate });
  });
});

/*=======================================================================
// Return a game. If submitted Returned On value doesn't meet required 
// constraints, push error string to Return Game form. Constraints 
// include not having a value, using the alphabet, and the Returned On 
// date being prior to today.
=======================================================================*/
router.post("/:id/return", function(req, res, next) {
  let error = [];
  let returned_on = req.body.returned_on;

  if (!returned_on || returned_on.match(/[a-z]/i) || returned_on < todaysDate) {
    error.push("Please enter a valid return date!");
    Rental.findAll({
      where: [
        {
          game_id: req.params.id
        }
      ],
      include: [{ model: Customer }, { model: Game }]
    }).then(function(rentals) {
      res.render("return_game", {
        rental: rentals[0],
        customer: rentals[1],
        game: rentals[2],
        todaysDate,
        errors: error
      });
    });
  } else {
    Rental.update(req.body, {
      where: [
        {
          game_id: req.params.id
        }
      ]
    }).then(function() {
      res.redirect("/rentals");
    });
  }
});

module.exports = router;
