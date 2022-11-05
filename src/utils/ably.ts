import { ABLY_KEY } from '@config';
import Ably from 'ably';

const client = new Ably.Realtime(ABLY_KEY);

function initializeAbly() {
  client.connection.on('connected', function () {
    console.log('Ably connection established');
  });

  const channel = client.channels.get('test');
  channel.subscribe(message => {
    console.log('Message received', message);
  });
}

export default client;
export { initializeAbly };
