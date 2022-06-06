/* eslint-disable linebreak-style */
const FCM = require("fcm-node");
const functions = require("firebase-functions");

exports.FCMm = functions.https.onRequest(async (request, response) => {
  // eslint-disable-next-line max-len
  const serverKey = "BEbvcttL61UptSHoKH-VMZ9MUBghGi_xTQAa6RxYHdgFo2TNxTEkB-8_W_exMLepIiNKCHkakz4PzXuZoXkB5Xo";
  const fcm = new FCM(serverKey);
  const userkey = request.body.FCM;
  try {
    const message = {
      to: userkey,
      notification: {
        title: "NotifcatioTestAPP",
        body: "{\"test masuk ga \"}",
      },
    };

    fcm.send(message, function(err, response) {
      if (err) {
        console.log("Something has gone wrong!" + err);
        console.log("Respponse:! " + response);
      } else {
        // showToast("Successfully sent with response");
        console.log("Successfully sent with response: ", response);
      }
    });
    response.status(201).send("berhasil kirim");
  } catch (error) {
    response.send(error);
  }
});
