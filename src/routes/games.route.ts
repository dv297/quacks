import { Router } from 'express';
import GamesController from '@controllers/games.controller';
import { Routes } from '@interfaces/routes.interface';

class GameRoute implements Routes {
  public path = '/games';
  public router = Router();
  public gamesController = new GamesController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.gamesController.getGames);
    this.router.get(`${this.path}/:gameId`, this.gamesController.getGameById);
    this.router.post(`${this.path}`, this.gamesController.createGame);
    this.router.delete(`${this.path}/:gameId`, this.gamesController.deleteGame);
  }
}

export default GameRoute;
