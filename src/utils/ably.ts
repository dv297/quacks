import { ABLY_KEY } from '@config';
import Ably from 'ably';
import { logger } from '@utils/logger';

// const players = GameModel.players;

const client = new Ably.Realtime(ABLY_KEY);

function initializeAbly() {
  client.connection.on('connected', function () {
    logger.info('Ably connection established');
  });

  // const channelMain = client.channels.get('main');
  // channelMain.subscribe(message => {
  //   if (message.name == 'joinGame') {
  //     gameState.gameId = generateRandomGameIdString(7);
  //     channelMain.publish('newGameId', gameState.gameId);
  //   }
  // });
}

function createGameChannel(gameId) {
  const channel = client.channels.get(gameId);
  channel.subscribe(message => {
    logger.info(gameId + message);
    // if (message.name == 'addPlayer') {
    //   addPlayer(message.data?.user);
    // }
  });
}

// function addPlayer(user) {
//   let newPlayer = {
//     username: user.username,
//   }
//   players.push(newPlayer);
//   logger.debug(`Added player: ${user}`);
// }

export default client;
export { initializeAbly, createGameChannel };
