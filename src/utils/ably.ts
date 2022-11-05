import { ABLY_KEY } from '@config';
import Ably from 'ably';

const client = new Ably.Realtime(ABLY_KEY);

function initializeAbly() {
  client.connection.on('connected', function () {
    console.log('Ably connection established');
  });

  const channel = client.channels.get('create-game');
  channel.subscribe(message => {
    console.log('create-game', message);
    if (message.name == 'joinGame') {
      channel.publish('newGameId', 'xgh64w');
      // channel.detach();
      // channel.on('detached', function(stateChange) {
      //   console.log('detached from the channel ' + channel.name);
      // });
    }
  });

  const channel2 = client.channels.get('xgh64w');
  channel2.subscribe(message => {
    console.log('xgh64w', message);
    console.log(message.name);
  });
}

export default client;
export { initializeAbly };
