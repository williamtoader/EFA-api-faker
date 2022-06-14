import {api, queries, mutations} from "./api.js"
import {faker} from "@faker-js/faker";

const name = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName()
}

api.call(mutations.CreateUser(
    {
        firstName: name.firstName,
        lastName: name.lastName,
        username: faker.internet.userName(name.firstName, name.lastName),
        email: faker.internet.email(name.firstName, name.lastName),
        password: faker.internet.password(10, true)
    }
)).then(
    data => {
        console.log("Mutation", data)
        api.call(
            queries.users
        ).then(
            data => console.log(data)
        )
    }

)




