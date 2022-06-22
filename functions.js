import { faker } from "@faker-js/faker";

export function generateUsers(amount=20) {
    let users = [];

    for(let i = 0; i < amount; ++i){
        const email = { 
            email: faker.internet.email(),
            valid: faker.datatype.boolean()
        };

        const profile = {
            id: i+1,
            biographyText: faker.lorem.paragraph(),
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            profilePhotoURL: "https://picsum.photos/200",
            review: [
                {
                    comment: faker.lorem.sentence(),
                    score1: 3.2,
                    score2: 5.0,
                    score3: 1.0
                },
                {
                    comment: faker.lorem.sentence(),
                    score1: 0.0,
                    score2: 4.1,
                    score3: 3.9
                }
            ]
        };

        const role = {
            role: faker.name.jobTitle()
        };

        const user = {
            email,
            profile,
            role
        };

        users.push(user);
    }

    return users;
}