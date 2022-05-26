const functions = require("firebase-functions");

// http request 1
exports.randomNumber = functions.https.onRequest((request, response) => {
  const number = Math.round(Math.random() * 100);
  response.send(number.toString());
  // eslint-disable-next-line semi
});

exports.sayHello = functions.https.onCall((data, context) => {
  // eslint-disable-next-line no-unused-vars
  const name = data.name;
  return `hello, ${name}`;
});
