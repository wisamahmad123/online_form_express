import { faker } from "@faker-js/faker"
import Answer from "../models/Answers.js"

const run = async (limit) => {
    try {
        let data = []
        for (let i = 0; i < limit; i++) {
            data.push({
                '67bd5d0ccdc04f60bec6a43a': faker.helpers.arrayElement(['99', '101', '102', '103']),
                '67c03558a47e22451d9cfad5': faker.person.fullName(),
                '67c0355ba47e22451d9cfad7': faker.helpers.arrayElements(['Ayam', 'Perkedel', 'Pisang']),
                'formId': '67bd5cc1cdc04f60bec6a438',
                'userId': '67b1ebd5683490127c3304a8'
            })          
        }
        const fakeData = await Answer.insertMany(data)
        if(fakeData){
            console.log(fakeData)
            process.exit()
        }
    } catch (err) {
        console.log(err)
        process.exit()
    }
}

export { run }