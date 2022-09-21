import { faker } from "@faker-js/faker";

export default function recommendationFactory() {
    const name = faker.name.jobTitle();

    return {
        name: name,
        youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y"
    }
}