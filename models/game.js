"use strict";

module.exports = (sequelize, DataTypes) => {
  var Game = sequelize.define("Game", {
    title: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Error: A title is required."
        }
      }
    },
    developer: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Error: A developer name is required."
        }
      }
    },
    genre: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Error: A genre is required."
        }
      }
    },
    first_published: {
      type: DataTypes.INTEGER,
      validate: {
        not: {
          args: /[a-zA-Z!@#$%\^&*()_+=[\]{}:;'".,/\\?`~\-<>]/gim,
          msg: "Error: First Published uses YYYY formatting."
        }
      }
    }
  });

  Game.associate = function(models) {
    Game.hasOne(models.Rental, { foreignKey: "game_id" });
  };

  return Game;
};
