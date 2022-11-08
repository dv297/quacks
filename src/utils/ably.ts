import { logger } from '@utils/logger';
import PlayerService from '@services/players.service';
import client from './ablyClient';

function initializeAbly() {
  client.connection.on('connected', function () {
    logger.info('Ably connection established');
  });
}

function createGameChannel(gameId) {
  const channel = client.channels.get(gameId);
  channel.subscribe(message => {
    logger.info(gameId + message);

    switch (message.name) {
      case 'addPlayer':
        addPlayer(gameId, message);
        break;
      case 'deletePlayer':
        deletePlayer(gameId, message);
        break;
      case 'updatePlayerName':
        updatePlayerName(gameId, message);
        break;
      default:
        const unknownMessage = `Message type not found: ${message.name}`;
        logger.info(unknownMessage);
    }
  });

  function addPlayer(gameId, message) {
    const user = message.data?.user;
    try {
      PlayerService.addPlayer(gameId, user);
      channel.publish('broadcastPlayerList', PlayerService.playerList(gameId));
    } catch (error) {
      logger.error(error);
      channel.publish('error', error.message);
    }
  }

  function deletePlayer(gameId, message) {
    const user = message.data?.user;
    try {
      PlayerService.deletePlayer(gameId, user);
      channel.publish('broadcastPlayerList', PlayerService.playerList(gameId));
    } catch (error) {
      logger.error(error);
      channel.publish(error.name, error.message);
    }
  }

  function updatePlayerName(gameId, message) {
    const user = message.data?.user;
    try {
      PlayerService.updatePlayerName(gameId, user);
      channel.publish('broadcastPlayerList', PlayerService.playerList(gameId));
    } catch (error) {
      logger.error(error);
      channel.publish(error.name, error.message);
    }
  }
}

export default client;
export { initializeAbly, createGameChannel };
