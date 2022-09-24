import { recommendationService } from "../../src/services/recommendationsService";
import { recommendationRepository } from "../../src/repositories/recommendationRepository";
import recommendationFactory from "../factories/recommendationFactory";

describe("Testes unitários do recommendationService", () => {
    it("Testa função insert: caso de sucesso", async () => {
        const recommendation = recommendationFactory();

        jest.spyOn(recommendationRepository, "findByName").mockImplementationOnce((): any => null);

        jest.spyOn(recommendationRepository, "create").mockImplementationOnce((): any => null);

        await recommendationService.insert(recommendation);

        expect(recommendationRepository.findByName).toBeCalled();
        expect(recommendationRepository.create).toBeCalled();
    });

    it("Testa função insert: caso de recomendação duplicada", async () => {
        const recommendation = recommendationFactory();

        jest.spyOn(recommendationRepository, "findByName").mockImplementationOnce((): any => {
            return recommendation;
        });

        const result = recommendationService.insert(recommendation);

        expect(recommendationRepository.findByName).toBeCalled();
        expect(result).rejects.toEqual({
            type: "conflict",
            message: "Recommendations names must be unique"
        });
    });

    it("Testa função upvote: caso de sucesso", async() => {
        const id = 1;
        const recommendation = recommendationFactory();

        jest.spyOn(recommendationRepository, "updateScore").mockImplementationOnce((): any => null);

        jest.spyOn(recommendationRepository, "find").mockImplementationOnce((): any => {
            return {
                id,
                ...recommendation,
                score: 0
            };
        });

        await recommendationService.upvote(id);

        expect(recommendationRepository.find).toBeCalled();
        expect(recommendationRepository.updateScore).toBeCalled();
    });

    it("Testa função upvote: caso de id não encontrado", async() => {
        const id = 1;

        jest.spyOn(recommendationRepository, "find").mockImplementationOnce((): any => {
            return null;
        });

        const result = recommendationService.upvote(id);

        expect(recommendationRepository.find).toBeCalled();
        expect(result).rejects.toEqual({
            type: "not_found",
            message: ""
        });
    });

    it("Testa função downvote: caso de sucesso", async() => {
        const id = 1;
        const recommendation = recommendationFactory();

        jest.spyOn(recommendationRepository, "updateScore").mockImplementationOnce((): any => {
            return {
                id,
                ...recommendation,
                score: 0
            };
        });

        jest.spyOn(recommendationRepository, "find").mockImplementationOnce((): any => {
            return {
                id,
                ...recommendation,
                score: 0
            };
        });

        await recommendationService.downvote(id);

        expect(recommendationRepository.find).toBeCalled();
        expect(recommendationRepository.updateScore).toBeCalled();
    });

    it("Testa função downvote: caso de id não encontrado", async() => {
        const id = 1;

        jest.spyOn(recommendationRepository, "find").mockImplementationOnce((): any => {
            return null;
        });

        const result = recommendationService.downvote(id);

        expect(recommendationRepository.find).toBeCalled();
        expect(result).rejects.toEqual({
            type: "not_found",
            message: ""
        });
    });

    it("Testa função downvote: caso de score abaixo de -5", async() => {
        const id = 1;
        const recommendation = recommendationFactory();

        jest.spyOn(recommendationRepository, "updateScore").mockImplementationOnce((): any => {
            return {
                id,
                ...recommendation,
                score: -6
            };
        });

        jest.spyOn(recommendationRepository, "remove").mockImplementationOnce((): any => {
            return null;
        })

        jest.spyOn(recommendationRepository, "find").mockImplementationOnce((): any => {
            return {
                id,
                ...recommendation,
                score: -6
            };
        });

        await recommendationService.downvote(id);

        expect(recommendationRepository.find).toBeCalled();
        expect(recommendationRepository.updateScore).toBeCalled();
        expect(recommendationRepository.remove).toBeCalled();
    });

    it("Testa função get: caso de sucesso", async () => {
        jest.spyOn(recommendationRepository, "findAll").mockImplementationOnce((): any => null);

        await recommendationService.get();

        expect(recommendationRepository.findAll).toBeCalled();
    });

    it("Testa função getTop: caso de sucesso", async () => {
        const amount = 10;

        jest.spyOn(recommendationRepository, "getAmountByScore").mockImplementationOnce((): any => null);

        await recommendationService.getTop(amount);

        expect(recommendationRepository.getAmountByScore).toBeCalled();
    });

    it("Testa função getRandom: caso de sucesso, random < 0.7 e há recomendação com score > 10", async () => {
        const recommendation = recommendationFactory();
        const returnedRecommendation = {
            id: 1,
            ...recommendation,
            score: 11
        }

        jest.spyOn(recommendationRepository, "findAll").mockImplementationOnce((): any => {
            return [returnedRecommendation];
        });

        const result = await recommendationService.getRandom();

        expect(result).toEqual(returnedRecommendation);
        expect(recommendationRepository.findAll).toBeCalled();
    });

    it("Testa função getRandom: caso de sucesso, random >= 0.7 e há recomendação com score <= 10", async () => {
        const recommendation = recommendationFactory();
        const returnedRecommendation = {
            id: 1,
            ...recommendation,
            score: 9
        }

        jest.spyOn(recommendationRepository, "findAll").mockImplementationOnce((): any => {
            return [returnedRecommendation];
        });

        const result = await recommendationService.getRandom();

        expect(result).toEqual(returnedRecommendation);
        expect(recommendationRepository.findAll).toBeCalled();
    });

    it("Testa função getRandom: caso de sucesso, random < 0.7 e não há recomendação com score > 10", async () => {
        const recommendation = recommendationFactory();
        const returnedRecommendation = {
            id: 1,
            ...recommendation,
            score: 9
        }

        //a primeira chamada retorna vazio
        jest.spyOn(recommendationRepository, "findAll").mockImplementationOnce((): any => {
            return [];
        });

        //a segunda chamada retorna a recomendação com score <= 10
        jest.spyOn(recommendationRepository, "findAll").mockImplementationOnce((): any => {
            return [returnedRecommendation];
        });

        const result = await recommendationService.getRandom();

        expect(result).toEqual(returnedRecommendation);
        expect(recommendationRepository.findAll).toBeCalled();
    });

    it("Testa função getRandom: caso de sucesso, random >= 0.7 e não há recomendação com score <= 10", async () => {
        const recommendation = recommendationFactory();
        const returnedRecommendation = {
            id: 1,
            ...recommendation,
            score: 11
        }

        //a primeira chamada retorna vazio
        jest.spyOn(recommendationRepository, "findAll").mockImplementationOnce((): any => {
            return [];
        });

        //a segunda chamada retorna a recomendação com score > 10
        jest.spyOn(recommendationRepository, "findAll").mockImplementationOnce((): any => {
            return [returnedRecommendation];
        });

        const result = await recommendationService.getRandom();

        expect(result).toEqual(returnedRecommendation);
        expect(recommendationRepository.findAll).toBeCalled();
    });

    it("Testa função getRandom: caso de nenhuma recomendação cadatrada", async () => {
        //a primeira chamada retorna vazio
        jest.spyOn(recommendationRepository, "findAll").mockImplementationOnce((): any => {
            return [];
        });

        //a segunda chamada também retorna vazio
        jest.spyOn(recommendationRepository, "findAll").mockImplementationOnce((): any => {
            return [];
        });

        const result = recommendationService.getRandom();

        expect(result).rejects.toEqual({
            type: "not_found",
            message: ""
        });
        expect(recommendationRepository.findAll).toBeCalled();
    });
});