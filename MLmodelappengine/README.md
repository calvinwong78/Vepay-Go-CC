
# Vepay-Go-CC(MLmodelappengine)
This repositories is for Cloud-computing path of vepay-go MLmodelappengine. 

## Description

This folder is for deploying character segmentation and character identification model to app engine 

## Getting Started

### Executing 
To deploy the model you need to make sure you are connected to your GCP account and have google cloud SDK installed you can check it by google auth list and make sure to use right account and right project and after that you can deploy the app engine by type this command  gcloud app deploy app.yaml --project YOURPROJECT-ID. Replace YOURPROJECT-ID with your own project id and if you don't set the region it will ask which region you want to deploy and wait couple of minute and you should get the URL
