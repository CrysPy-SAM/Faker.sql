import { faker } from '@faker-js/faker';

let getRandomUser = () => ({
    id: faker.string.uuid(),  // Use faker.string.uuid() instead of faker.datatype.uuid()
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
});

console.log(getRandomUser());
