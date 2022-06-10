
# Vepay-Go-CC(SQLfrcarfunction)
This repositories is for Cloud-computing path of vepay-go SQLfrcarfunction. 

## Description

This folder is for deploying SQL API using firebase function. and it use Typescript for the language or more spesific it used TypeOrm for query 

## Getting Started

### Executing 
To deploy the function you need to make sure download all the depedencies in package.json to do that you need to make sure you are in folder which package.json is located for example in my folder my package.json is in functions so I need to CD to functions and run npm install in terminal to download all the depedencies you can make sure if its downloaded by check if there is node_modules in your folder. after that you can CD .. to change diretory to previous directory which is in my case is SQLfrcarfunction and run the following command ```npm run build && firebase deploy``` when in firebase init you select functions and hosting and you want to deploy only functions you can type this command ```npm run build && firebase deploy --only functions```
