import TelegramBot from "node-telegram-bot-api";
import { globalBotCommands } from "../../commands";
import { StickersIDs } from "../../stickers/constants";


export async function addFisherloverGreeting(bot: TelegramBot) {

  globalBotCommands.push(
    { command: '/start', description: 'Приветствие любителя рыбы' },
  );

  bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    if (msg.text === '/start') {
      await bot.sendSticker(chatId, StickersIDs.goodaev);
      await bot.sendMessage(
        chatId,
        `Привеееет! Я Глег Гудаев))))) А ты? Ты ${
          msg.chat.first_name ? msg.chat.first_name : ''
        } ${msg.chat.last_name ? msg.chat.last_name : ''}`,
      );
    }
    // if (msg.text?.toLowerCase() === 'рыба?') {
    //   await bot.sendMessage(chatId, 'Килечка');
    // }
  });
  
}
