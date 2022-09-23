import { prisma } from "../database.js";
import { Recommendation } from "@prisma/client";
type IRecommendationCreateType = Omit<Recommendation, "id" | "score">;

export async function truncate() {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations`;
}

export async function getRecommendationByName(name: string) {
    const recommendation = await prisma.recommendation.findUnique({ where: { name } });

    return recommendation;
}

export async function createRandomRecommendations(recomendation: IRecommendationCreateType) {
    await prisma.recommendation.create({ data: recomendation });
}