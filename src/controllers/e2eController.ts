import * as e2eService from "../services/e2eService.js";
import { Request, Response } from "express";

export async function reset(req: Request, res: Response) {
    await e2eService.truncate();

    res.sendStatus(200);
}

export async function getRecommendationByName(req: Request, res: Response) {
    const { name } = req.params;

    const recommendation = await e2eService.getRecommendationByName(name);

    res.status(200).send(recommendation);
}

export async function createRandomRecommendations(req: Request, res: Response) {
    const numberOfCreatedRecommendations = await e2eService.createRandomRecommendations();

    res.status(201).send({ numberOfCreatedRecommendations });
}