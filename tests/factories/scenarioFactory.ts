import { prisma } from "../../src/database";
import { Recommendation } from "@prisma/client";

type IRecommendationCreateType = Omit<Recommendation, "id" | "score">;
type IRecommendationType = Omit<Recommendation, "id">;

export async function deleteAllData() {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations`;
}

export async function disconnectPrisma() {
    await prisma.$disconnect();
}

export async function createScenarioWithOneRecommendation(recommendation: IRecommendationCreateType) {
    await prisma.recommendation.create({
        data: recommendation,
    });
}

export async function createScenarioRecommendationsWithRandomUpvotes(recommendation: IRecommendationCreateType) {
    const randomUpvotes = Math.floor(Math.random() * 100); //número aleatório entre 0 e 100

    await prisma.recommendation.create({
        data: recommendation,
    });

    const createdRecomendation = await prisma.recommendation.findUnique({
        where: { name: recommendation.name }
    })

    for (let i = 0; i < randomUpvotes; i++) {
        await prisma.recommendation.update({
            where: { id: createdRecomendation.id },
            data: {
                score: { increment: 1 },
            },
        });
    }
}