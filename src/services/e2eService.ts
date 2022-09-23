import * as e2eRepository from "../repositories/e2eRepository.js";
import { faker } from "@faker-js/faker";

export async function truncate() {
    await e2eRepository.truncate();
}

export async function getRecommendationByName(name: string) {
    const recommendation = await e2eRepository.getRecommendationByName(name);

    return recommendation;
}

export async function createRandomRecommendations() {
    const randomNumber = Math.floor(Math.random()*16); // número aleatório entre 0 e 15

    for (let i = 0; i < randomNumber; i++) {
        const name = faker.lorem.words(4);

        const recommendation = {
            name: name,
            youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y"
        }

        await e2eRepository.createRandomRecommendations(recommendation);
    }

    return randomNumber;
    
}