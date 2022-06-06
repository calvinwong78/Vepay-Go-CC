/* eslint-disable linebreak-style */
module.exports = {
  ...require("./controller/user"),
  ...require("./controller/vehicle"),
  ...require("./controller/transaction"),
  ...require("./controller/authadmin"),
  ...require("./controller/FCM"),
};

