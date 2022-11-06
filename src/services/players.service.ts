import { logger } from '@utils/logger';
import { GameRuleException } from '@/exceptions/GameRuleException';
import playerModel from '@models/players.model';

class PlayerService {
  public static playerList() {
    logger.info(`Sending player list: ${JSON.stringify(playerModel)}`)
    return playerModel;
  }

  public static addPlayer(user) {
    this.validateNewUser(user);

    let newPlayer = {
      id: user.id,
      name: user.name || '',
    }
    playerModel[newPlayer.id] = newPlayer;
  
    logger.info(`Added player: ${JSON.stringify(user)}. Players: ${JSON.stringify(playerModel)}`);
  }

  public static deletePlayer(user) {
    if (playerModel[user.id]) {
        delete playerModel[user.id];
        logger.info(`Deleted player: ${JSON.stringify(user)}. Players: ${JSON.stringify(playerModel)}`);
    } else {
        logger.info(`Player does not exist so could not delete: ${JSON.stringify(user)}. Players: ${JSON.stringify(playerModel)}`);
    }
  }

  public static updatePlayerName(user) {
    this.validatePlayerNameChange(user);

    const playerOldName = playerModel[user.id].name;

    let player = {
      id: user.id,
      name: user.name || '',
    }
    playerModel[player.id] = player;
  
    logger.info(`Updated player name ${playerOldName} to ${JSON.stringify(user.name)} for Player ID ${user.id}`);
  }
  
  private static validateNewUser(user) {
    const uniqueId = !playerModel.hasOwnProperty(user.id);
    if (user.id === '' || !user.id) {
        throw new GameRuleException(400, 'InvalidPlayerException', `Player ID cannot be empty. Player ID: ${JSON.stringify(user.id)}`);
    } else if (!uniqueId) {
        throw new GameRuleException(400, 'InvalidPlayerException', `Player ID ${JSON.stringify(user.id)} already exists.`);
    }
  }

  private static validatePlayerNameChange(user) {
    const userExists = playerModel.hasOwnProperty(user.id);
    if (user.name === '' || !user.name) {
        throw new GameRuleException(400, 'InvalidPlayerException', `Player name cannot be empty. Player name given: ${JSON.stringify(user.name)}`);
    } else if (!userExists) {
        throw new GameRuleException(400, 'InvalidPlayerException', `Player ID ${JSON.stringify(user.id)} does not exist.`);
    }
  }
}

export default PlayerService;
