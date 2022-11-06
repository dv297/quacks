import { NextFunction, Request, Response } from 'express';
import { CreateGameDto } from '@dtos/games.dto';
import { Game } from '@interfaces/games.interface';
import gameService from '@services/game.service';
import { createGameChannel } from '@utils/ably';

class GamesController {
  public gameService = new gameService();

  public getGames = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findAllGamesData: Record<string, Game> = await this.gameService.findAllGames();

      res.status(200).json({ data: findAllGamesData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getGameById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const gameId = String(req.params.gameId);
      const findOneGameData: Game = await this.gameService.findGameById(gameId);

      res.status(200).json({ data: findOneGameData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createGame = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const newGameId = this.generateRandomGameIdString(7);
        const gameData: CreateGameDto = { gameId: newGameId };
        const createGameData: Game = await this.gameService.createGame(gameData);

        createGameChannel(newGameId);        
        res.status(201).json({ data: createGameData, message: 'created' });
      } catch (error) {
        next(error);
      }
  };

  public deleteGame = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const gameId = String(req.params.gameId);
      const deleteGameData: Game = await this.gameService.deleteGame(gameId);

      res.status(200).json({ data: deleteGameData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };

  private generateRandomGameIdString(gameIdLength) {
    let result = '';
  
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < gameIdLength; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
  
    return result;
  }
}

export default GamesController;
