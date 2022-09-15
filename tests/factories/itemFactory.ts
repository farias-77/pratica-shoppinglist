import { faker } from "@faker-js/faker";

export default function itemFactory(){
    const item = {
        title: faker.commerce.product(),
        url: faker.internet.url(),
        description: faker.commerce.productDescription(),
        amount: Number(faker.random.numeric())
    }

    return item;
}