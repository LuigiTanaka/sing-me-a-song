import { Router } from "express";
import * as e2eController from "../controllers/e2eController.js";

const e2eRouter = Router();

e2eRouter.post("/e2e/reset", e2eController.reset);
e2eRouter.get("/e2e/:name", e2eController.getRecommendationByName);
e2eRouter.post("/e2e/create", e2eController.createRandomRecommendations);

export default e2eRouter;