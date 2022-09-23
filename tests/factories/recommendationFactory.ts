import { faker } from "@faker-js/faker";

export default function recommendationFactory() {
    const name = faker.lorem.words(4);

    return {
        name: name,
        youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y"
    };
};