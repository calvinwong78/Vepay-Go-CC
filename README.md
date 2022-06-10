# Vepay-Go-CC
This repositories is for Cloud-computing path of vepay-go. 

## Description

In this repositories there is 3 folder which is MLmodelappengine, SQLcarfunction and vepay-go-website-admin. MLmodelappengine is for deployment model and deployed in GAE(Google App Engine) using flask also contain (1 model of our ML model). SQLcarfunction is API for sql query of our application which using TypeOrm and deployed using firebase function. vepay-go-website-admin is frontend of our admin website also contain 1 model of our ML model this folder also contain our NOSQL api which is being used and for frontend we use html,css,javascript and react.

## Getting Started

**In this project we use mostly use firebase services,first to hosting our website we use firebase hosting and second for NOSQL API we deplyoed using firebase function._Take a note to run our app you need access to our Google Cloud Platform project so its better for you to copy our code and run using your own project._
we also create API for SQL database so you can choose using SQL or NOSQL database but for now we are using NOSQL database.**

### Installing

* What you need : 
      <br>Text editor(Visual Studio Code recommended), firebase project/GCP project(GCP project and Firebase project is connected) and browser(Chrome   recommended)          </br>
* If this is your first time using firebase then follow this following step to help you initialize Firebase environment 
  <br>-Make sure to have project created in firebase console
  <br>-Make a folder for your project 
  <br>-Open Visual Studio Code
  <br>-Change directory to your project folder 
  <br>-Open new CMD and npm install -g firebase-tools(make sure you have NPM installed)
  <br>-In CMD type firebase login and it will redirect you to browser to login to your firebase account or gcp account 
  <br>-In CMD type firebase init and it will ask you a couple of question about which project you want to use and what services you want to use like hosting or function etc.
  <br>-and after firebase init now you have firebase environment
* Because we already uploaded package.json so you just need to copy it from our repository and npm install(For detail how to install you can view Readme file in each folder)

## Acknowledgments

Inspiration, code snippets, etc.
* [SQLAPI Inspiration](https://fireship.io/lessons/sql-firebase-typeorm/)
* [NOSQLAPI Inspiration](https://www.youtube.com/watch?v=iIVlRZIo2-c)
* [firebase documentation](https://firebase.google.com/docs?gclid=CjwKCAjw14uVBhBEEiwAaufYx45yf256E80Fsd_R_1GgI6q8UUyaylC97TGyqblCuY5N_zcRNno5MhoCQRYQAvD_BwE&gclsrc=aw.ds)
