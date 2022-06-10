# Vepay-Go-CC(vepay-go-website-admin)
This repositories is for Cloud-computing path of vepay-go vepay-go-website-admin. 

## Description

This folder is for deploying Fontend and NOSQL API, in this folder we use HTML,REACT,CSS and javascript.


## Getting Started

### Executing 
To deploy the function you need to make sure download all the depedencies in package.json to do that you need to make sure you are in folder which package.json is located for example in my folder my package.json is in functions so I need to CD to functions and ```run npm install``` in terminal to download all the depedencies you can make sure if its downloaded by check if there is node_modules in your folder. after that you can CD .. to change diretory to previous directory which is in my case is vepay-go-website-admin and run again ```run npm install``` because in this folder there is 2 package.json the first one is for react and html and the second one is for functions folder which cointain our NOSQL API. after all depedencies dowloaded run the following command ```npm run build && firebase deploy``` and it will deploy both function and frontend and wait for url in terminal or you can check the url for function and hosting in firebase console.
