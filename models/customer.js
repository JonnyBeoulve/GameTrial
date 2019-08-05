"use strict";

module.exports = (sequelize, DataTypes) => {
  var Customer = sequelize.define("Customer", {
    first_name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Error: A First Name is required."
        }
      }
    },
    last_name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Error: A Last Name is required."
        }
      }
    },
    address: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Error: An Address is required."
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Error: An Email is required!"
        },
        isEmail: {
          args: true,
          msg: "Error: The Email must be valid!"
        }
      }
    },
    epic_id: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Error: An Epic ID is required."
        }
      }
    },
    zip_code: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: "Error: A Zip Code is required."
        },
        not: {
          args: /[a-zA-Z!@#$%\^&*()_+=[\]{}:;'".,/\\?`~\-<>]/gim,
          msg: "Error: The Zip Code may only contain numbers."
        }
      }
    }
  });

  Customer.associate = function(models) {
    Customer.hasMany(models.Rental, { foreignKey: "customer_id" });
  };

  return Customer;
};
