import { prisma } from "../../src/database";
import supertest from "supertest";
import app from "../../src/app";
import recommendationFactory from "../factories/recommendationFactory";
import { Recommendation } from "@prisma/client";

import { createScenarioRecommendationsWithRandomUpvotes, createScenarioWithOneRecommendation, deleteAllData, disconnectPrisma } from "../factories/scenarioFactory";
import { faker } from "@faker-js/faker";

beforeEach(async () => {
    await deleteAllData();
});

const server = supertest(app);
type IRecommendationCreateType = Omit<Recommendation, "id" | "score">;
type IRecommendationType = Omit<Recommendation, "id">;

describe('Testes das rotas de músicas recomendadas', () => {
    it('Testa caso de sucesso POST /recommendations', async () => {
        const recommendation = recommendationFactory();

        const result = await server.post('/recommendations').send(recommendation);

        const createdRecommendation = await prisma.recommendation.findUnique({
            where: {
                name: recommendation.name
            },
        });

        expect(result.status).toBe(201);
        expect(createdRecommendation).not.toBeFalsy();
    });

    it('Testa erro de conflito (409) POST /recommendations', async () => {
        const recommendation = recommendationFactory();

        await createScenarioWithOneRecommendation(recommendation);
        const result = await server.post('/recommendations').send(recommendation);

        const createdRecommendation = await prisma.recommendation.findMany({
            where: {
                name: recommendation.name
            },
        });

        expect(result.status).toBe(409);
        expect(createdRecommendation.length).toBe(1);
    });

    it('Testa caso de sucesso POST /recommendations/:id/upvote', async () => {
        const recommendation = recommendationFactory();

        await createScenarioWithOneRecommendation(recommendation);

        const createdRecommendation = await prisma.recommendation.findUnique({
            where: {
                name: recommendation.name
            },
        });

        const result = await server.post(`/recommendations/${createdRecommendation.id}/upvote`);

        const updatedCreatedRecommendation = await prisma.recommendation.findUnique({
            where: {
                name: recommendation.name
            },
        });

        const oldScore = createdRecommendation.score;
        const newScore = updatedCreatedRecommendation.score;

        expect(result.status).toBe(200);
        expect(newScore).toBe(oldScore + 1);
    });

    it('Testa erro de recomendação não encontrada (404) POST /recommendations/:id/upvote', async () => {
        //banco está vazio, então qualquer id deveria retornar 404
        const randomId = Math.floor(Math.random()*500); //número aleatório entre 0 e 500
        const result = await server.post(`/recommendations/${+randomId}/upvote`);

        expect(result.status).toBe(404);
    });

    it('Testa caso de sucesso POST /recommendations/:id/downvote', async () => {
        const recommendation = recommendationFactory();

        await createScenarioWithOneRecommendation(recommendation);

        const createdRecommendation = await prisma.recommendation.findUnique({
            where: {
                name: recommendation.name
            },
        });

        const result = await server.post(`/recommendations/${createdRecommendation.id}/downvote`);

        const updatedCreatedRecommendation = await prisma.recommendation.findUnique({
            where: {
                name: recommendation.name
            },
        });

        const oldScore = createdRecommendation.score;
        const newScore = updatedCreatedRecommendation.score;

        expect(result.status).toBe(200);
        expect(newScore).toBe(oldScore - 1);
    });

    it('Testa se ao atingir pontuação abaixo de -5 a recomendação é excluida POST /recommendations/:id/downvote', async () => {
        const recommendation = recommendationFactory();

        await createScenarioWithOneRecommendation(recommendation);

        const createdRecommendation = await prisma.recommendation.findUnique({
            where: {
                name: recommendation.name
            },
        });

        for (let i = 0; i <= 5; i++) {
            await server.post(`/recommendations/${createdRecommendation.id}/downvote`);
        }

        const result = await prisma.recommendation.findUnique({
            where: {
                id: createdRecommendation.id
            },
        });

        expect(result).toBeFalsy();
    })

    it('Testa erro de recomendação não encontrada (404) POST /recommendations/:id/downvote', async () => {
        //banco está vazio, então qualquer id deveria retornar 404
        const randomId = Math.floor(Math.random()*500); //número aleatório entre 0 e 500
        const result = await server.post(`/recommendations/${+randomId}/downvote`);

        expect(result.status).toBe(404);
    });

    it('Testa caso de sucesso GET /recommendations', async () => {
        const randomNumber = Math.floor(Math.random()*16); // número aleatório entre 0 e 15

        for (let i = 0; i < randomNumber; i++) {
            const recommendation = recommendationFactory();
            await createScenarioWithOneRecommendation(recommendation);
        }

        const latestRecommendations = await prisma.recommendation.findMany({
            orderBy: { id: "desc" },
            take: 10
        });

        const result = await server.get('/recommendations');

        expect(result.body).toEqual(latestRecommendations);
    });

    it('Testa caso de sucesso GET /recommendations/:id', async () => {
        const recommendation = recommendationFactory();

        await createScenarioWithOneRecommendation(recommendation);

        const createdRecommendation = await prisma.recommendation.findUnique({
            where: {
                name: recommendation.name
            },
        });

        const result = await server.get(`/recommendations/${createdRecommendation.id}`);

        expect(result.body).toEqual(createdRecommendation);
    });

    it('Testa erro de recomendação não encontrada (404) GET /recommendations/:id', async () => {
        //banco está vazio, então qualquer id deveria retornar 404
        const randomId = Math.floor(Math.random()*500); //número aleatório entre 0 e 500
        const result = await server.post(`/recommendations/${+randomId}`);

        expect(result.status).toBe(404);
    });

    it('Testa sucesso GET /recommendations/random', async () => {
        const recommendation = recommendationFactory();

        await createScenarioWithOneRecommendation(recommendation);

        const createdRecommendation = await prisma.recommendation.findUnique({
            where: {
                name: recommendation.name
            },
        });

        const result = await server.get(`/recommendations/random`);

        expect(result.body).toEqual(createdRecommendation);
    });

    it('Testa erro de recomendação não encontrada (404) GET /recommendations/random', async () => {
        //banco está vazio
        const result = await server.get(`/recommendations/random`);

        expect(result.status).toBe(404);
    });

    it('Testa sucesso GET /recommendations/top/:amount', async () => {
        const randomAmount = Math.floor(Math.random()*10); //número aleatório entre 0 e 10
        const randomCreations = Math.floor(Math.random()*10); //número aleatório entre 0 e 10

        for(let i = 0; i < randomCreations; i++) {
            const recommendation = recommendationFactory();
            await createScenarioRecommendationsWithRandomUpvotes(recommendation);
        }

        const topRecommendations = await prisma.recommendation.findMany( {
            orderBy: { score: "desc" },
            take: randomAmount
        });

        const result = await server.get(`/recommendations/top/${randomAmount}`);

        expect(result.body).toEqual(topRecommendations);
    });
});

afterAll(async () => {
    await disconnectPrisma();
})