import { Api, TelegramClient } from 'telegram/index.js';
import { StoreSession } from 'telegram/sessions/index.js';
import input from 'input';

import config from './config.js';

const apiId = config.apiId;
const apiHash = config.apiHash;
const storeSession = new StoreSession('telegram_session');

(async () => {
  console.log('Loading interactive example...');
  const client = new TelegramClient(storeSession, apiId, apiHash, {
    connectionRetries: 5
  });
  await client.start({
    phoneNumber: async () => await input.text('Please enter your number: '),
    password: async () => await input.text('Please enter your password: '),
    phoneCode: async () => await input.text('Please enter the code you received: '),
    onError: (err) => console.log(err)
  });
  console.log('You should now be connected.');

  client.addEventHandler(async (update) => {
    if (update.className === 'UpdateShortChatMessage' && update.chatId.value === 4019732237n) {
      console.log('Received new Update');
      console.log(update);
      console.log(update.id);
      console.log('update.id');

      await client.sendMessage(new Api.InputPeerChat({chatId: 4019732237n}), {
        message: 'Hello there!',
        replyTo: update.id
      });
    }
  });

})();