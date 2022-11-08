import Ably from 'ably';
import { ABLY_KEY } from '@config';

const client = new Ably.Realtime(ABLY_KEY);

export default client;
