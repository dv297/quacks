import { logger } from '@utils/logger';
import { GameRuleException } from '@/exceptions/GameRuleException';
import playerModel from '@models/players.model';
import gameModel from '@models/game.model';

class PlayerService {
  public static playerList(gameId) {
    logger.info(`Sending player list: ${JSON.stringify(gameModel[gameId].players)}`);
    return gameModel[gameId].players;
  }

  public static addPlayer(gameId, user) {
    this.validateNewUser(user);

    const newPlayer = {
      id: user.id,
      name: user.name || '',
    };
    playerModel[newPlayer.id] = newPlayer;
    gameModel[gameId].players[newPlayer.id] = newPlayer;

    logger.info(`Added player: ${JSON.stringify(user)}. Players: ${JSON.stringify(playerModel)}`);
  }

  public static deletePlayer(gameId, user) {
    if (playerModel[user.id]) {
      delete playerModel[user.id];
      delete gameModel[gameId].players[user.id];
      logger.info(`Deleted player: ${JSON.stringify(user)}. Players: ${JSON.stringify(playerModel)}`);
    } else {
      logger.info(`Player does not exist so could not delete: ${JSON.stringify(user)}. Players: ${JSON.stringify(playerModel)}`);
    }
  }

  public static updatePlayerName(gameId, user) {
    this.validatePlayerNameChange(user);

    const playerOldName = playerModel[user.id].name;

    const player = {
      id: user.id,
      name: user.name || '',
    };
    playerModel[player.id] = player;
    gameModel[gameId].players[player.id] = player;

    logger.info(`Updated player name ${playerOldName} to ${JSON.stringify(user.name)} for Player ID ${user.id}`);
  }

  private static validateNewUser(user) {
    if (!this.isObjectType(user)) {
      throw new GameRuleException(400, 'InvalidPlayerException', `Player ${JSON.stringify(user)} is not an object.`);
    } else if (!user.id || user.id === '') {
      throw new GameRuleException(400, 'InvalidPlayerException', `Player ID cannot be empty. Player ID: ${JSON.stringify(user.id)}`);
    } else if (playerModel.hasOwnProperty(user.id)) {
      throw new GameRuleException(400, 'InvalidPlayerException', `Player ID ${JSON.stringify(user.id)} already exists.`);
    }
  }

  private static isObjectType(variable) {
    return typeof variable === 'object' && !Array.isArray(variable) && variable !== null;
  }

  private static validatePlayerNameChange(user) {
    if (!user.id || !playerModel.hasOwnProperty(user.id)) {
      throw new GameRuleException(400, 'InvalidPlayerException', `Player ID ${JSON.stringify(user.id)} does not exist.`);
    } else if (user.name === '' || !user.name) {
      throw new GameRuleException(400, 'InvalidPlayerException', `Player name cannot be empty. Player name given: ${JSON.stringify(user.name)}`);
    }
  }
}

export default PlayerService;
