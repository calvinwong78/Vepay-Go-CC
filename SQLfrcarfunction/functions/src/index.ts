import * as functions from 'firebase-functions';

import { connect } from './config';

import { car } from './entity/Vehicle';



export const getallcar = functions.https.onRequest(async (request, response) => {


    const connection = await connect();
    const carRepo = connection.getRepository(car);
    const allcar = await carRepo.find();
    response.send(allcar);

});

export const deletecarbyid = functions.https.onRequest(async (request, response) => {

   
    
    try {
        const connection = await connect();
         await connection.getRepository(car).delete(request.body);
        response.status(201).send({"response": "delete success! "});
        
    } catch (error) {
        response.send(error)
    }
});

/*export const deleteallcar = functions.https.onRequest(async (request, response) => {


    try {
        const connection = await connect();
         await connection.getRepository(car).delete();
        response.status(201).send({"response": "delete success! "});
        
    } catch (error) {
        response.send(error)
    }

});*/

export const createcar = functions.https.onRequest(async (request, response) => {

    const { name, VehicleID } = request.body;

    try {
        const connection = await connect();

        const repo = connection.getRepository(car);

        const newHippo = new car();
        newHippo.name = name;
        newHippo.VehicleID = VehicleID;


        const savedHippo = await repo.save(newHippo);

        response.send(savedHippo);

    } catch (error) {
        response.send(error)
    }

});
/*
export const updatebyid = functions.https.onRequest(async (request, response) => {


    try {
        const connection = await connect();
        const repo = connection.getRepository(car);

         const post = await repo.findOne(request.body.id);
         if (post) {
            repo.merge(post, request.body);
            const result =  repo.save(post);
            response.send(result);
            
         }
        
    } catch (error) {
        response.send(error)
    }
}); 
*/



export const updatebyid = functions.https.onRequest(async (request, response) => {
    
        try {
            const connection = await connect();
        await connection.getRepository(car)
        .createQueryBuilder()
        .update(car)
        .set({ name: request.body.name, VehicleID: request.body.VehicleID })
        .where("id = :id", { id: request.body.id })
        .execute()
        response.status(201).send({"response": "update success! "});
            
        } catch (error) {
            response.send(error)
        }
    });


