import { CreateGameDto } from '@dtos/games.dto';
import { HttpException } from '@exceptions/HttpException';
import { Game } from '@interfaces/games.interface';
import gameModel from '@models/game.model';
import { isEmpty } from '@utils/util';

class GameService {
  public games = gameModel;

  public async findAllGames(): Promise<Record<string, Game>> {
    const games: Record<string, Game> = this.games;
    return games;
  }

  public async findGameById(gameId: string): Promise<Game> {
    const findGame: Game = this.games[gameId];
    if (!findGame) throw new HttpException(409, `[ERROR] Game ${gameId} doesn't exist.`);

    return findGame;
  }

  public async createGame(gameData: CreateGameDto): Promise<Game> {
    if (isEmpty(gameData)) throw new HttpException(400, 'gameData is empty');

    const findGame: Game = this.games.gameId;
    if (findGame) throw new HttpException(409, `This game ${gameData.gameId} already exists`);

    const createGameData: Game = { ...gameData };
    this.games[gameData.gameId] = createGameData;

    return createGameData;
  }

  public async deleteGame(gameId: string): Promise<Game> {
    const findGame: Game = this.games[gameId];
    if (!findGame) throw new HttpException(409, `Game ${gameId} doesn't exist`);

    const deleteGameData: Game = this.games[gameId];
    delete this.games[gameId];

    return deleteGameData;
  }
}

export default GameService;
