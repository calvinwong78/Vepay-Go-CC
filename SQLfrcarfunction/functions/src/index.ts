import * as functions from 'firebase-functions';
import { connect } from './config';

import { car } from './entity/Vehicle';
import { Hat } from './entity/backup';


export const getcar = functions.https.onRequest(async (request, response) => {


    const connection = await connect();
    const carRepo = connection.getRepository(car);


    // Count records
    // const count = await hippoRepo.count();

    // // Get all 
    const allcar = await carRepo.find();

    // Raw SQL Query
    // const query = await hippoRepo.query('SELECT name FROM hippo WHERE WEIGHT > 5');


    // const hipposWearingHats = await hippoRepo
    //                             .createQueryBuilder('hippo')
    //                             .leftJoinAndSelect('hippo.hats', 'hat')
    //                             .getMany();

    response.send(allcar);

});


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


export const createHat = functions.https.onRequest(async (request, response) => {

    const { owner, color } = request.body;

    try {
        const connection = await connect();
        const repo = connection.getRepository(Hat);

        const newHat = new Hat();
        newHat.owner = owner;
        newHat.color = color;

        const savedHat = await repo.save(newHat);
        response.send(savedHat);

    } catch (error) {
        response.send(error)
    }
});