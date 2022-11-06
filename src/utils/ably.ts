import { ABLY_KEY } from '@config';
import Ably from 'ably';
import { logger } from '@utils/logger';
import PlayerService from '@services/players.service';

const client = new Ably.Realtime(ABLY_KEY);

function initializeAbly() {
  client.connection.on('connected', function () {
    logger.info('Ably connection established');
  });
}

function createGameChannel(gameId) {
  const channel = client.channels.get(gameId);
  channel.subscribe(message => {
    logger.info(gameId + message);

    switch(message.name) {
      case 'addPlayer':
        addPlayer(message);
        break;
      case 'deletePlayer':
        deletePlayer(message);
        break;
      case 'updatePlayerName':
        updatePlayerName(message);
        break;
      case 'playerList':
        channel.publish('broadcastPlayerList', PlayerService.playerList());
        break;
      default:
        const unknownMessage = `Message type not found: ${message.name}`;
        logger.info(unknownMessage);
    }
  });

  function addPlayer(message) {
    const user = message.data?.user;
    try {
      PlayerService.addPlayer(user); 
      channel.publish('broadcastPlayerList', PlayerService.playerList());
    } catch (error) {
      logger.error(error);
      channel.publish(error.name, error.message); 
    }
  }
  
  function deletePlayer(message) {
    const user = message.data?.user;
    try {
      PlayerService.deletePlayer(user); 
      channel.publish('broadcastPlayerList', PlayerService.playerList());
    } catch (error) {
      logger.error(error);
      channel.publish(error.name, error.message); 
    }
  }

  function updatePlayerName(message) {
    const user = message.data?.user;
    try {
      PlayerService.updatePlayerName(user);
      channel.publish('broadcastPlayerList', PlayerService.playerList());
    } catch (error) {
      logger.error(error);
      channel.publish(error.name, error.message); 
    }
  }
}

export default client;
export { initializeAbly, createGameChannel };
