'use strict';

module.exports = (sequelize, DataTypes) => {
  var Rental = sequelize.define('Rental', {
    game_id: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: 'Error: A game ID is required.'
        }
      }
    },
    customer_id: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: 'Error: A customer ID is required.'
        },
        not: {
          args: /[a-zA-Z!@#$%\^&*()_+=[\]{}:;'".,/\\?`~\-<>]/gim,
          msg: 'Error: The customer ID may only contain numbers.'
        }
      }
    },
    rented_on: {
      type: DataTypes.DATEONLY,
      validate: {
        notEmpty: {
          msg: 'Error: Rented on is required.'
        },
        isDate: {
          msg: 'Error: Rented on must be a valid date.'
        }
      }
    },
    return_by: {
      type: DataTypes.DATEONLY,
      validate: {
        notEmpty: {
          msg: 'Error: Return by is required.'
        },
        isDate: {
          msg: 'Error: Return by must be a date.'
        },
        isAfter: {
          args: Date('now'),
          msg: 'Error: Return by must be a valid date.'
        }
      }
    },
    returned_on: {
      type: DataTypes.DATEONLY,
      validate: {
        isDate: {
          msg: 'Error: Returned on must be a valid date.'
        }
      }
    }
  })

  Rental.associate = function(models) {
    Rental.belongsTo(models.Game, { foreignKey: "game_id" });
    Rental.belongsTo(models.Customer, { foreignKey: "customer_id" });
  };

  return Rental;
};
