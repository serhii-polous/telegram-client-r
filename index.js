import { Api, TelegramClient } from 'telegram/index.js';
import { StoreSession } from 'telegram/sessions/index.js';
import input from 'input';

import config from './config.js';

const apiId = config.apiId;
const apiHash = config.apiHash;
const storeSession = new StoreSession('telegram_session');

const checkMessage = (message) => {
  if (!message || typeof message !== 'string') {
    return false;
  }

  const lowerCasedMessage = message.toLowerCase();

  for (let key of config.keys) {
    if (lowerCasedMessage.includes(key)) {
      return true;
    }
  }

  return false;
};

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
  // if (update.className === 'UpdateShortChatMessage') {
  //   console.log('------------')
  //   console.log(update.message)
  //   console.log(update.chatId)
  //   console.log('------------')
  // }

  if (update.className === 'UpdateShortChatMessage' && checkMessage(update.message)) {
    await client.forwardMessages(new Api.InputPeerChat({chatId: config.chatId}), {
      messages: [update.id],
      fromPeer: new Api.InputPeerChat({chatId: update.chatId})
    });
  }

  if (update.className === 'UpdateNewChannelMessage' && checkMessage(update.message.message)) {
    await client.forwardMessages(new Api.InputPeerChat({chatId: config.chatId}), {
      messages: [update.message.id],
      fromPeer: update.message.peerId
    });
  }
});
