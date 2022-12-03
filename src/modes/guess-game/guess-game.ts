import * as TelegramBot from 'node-telegram-bot-api';
import { globalBotCommands } from '../../commands';

// const guessGameBotCommands: TelegramBot.BotCommand[] = [
//   {command: '/'}
// ]

interface IGameState {
  areNumbersPicked: boolean;
  startNumber: number | null;
  endNumber: number | null;
}

const gameBotCommands: TelegramBot.BotCommand[] = [
  {
    command: '/exit',
    description: 'Сдаться и потратить банку вкуснейшей кильки',
  },
];

const gameStates: Record<string, IGameState> = {};

const gameRules = `Вы выбираете два числа, между которыми я загаю вам своё число. Ваша задача - угадать, какое число я загадал. Если вы будете тупить - на следующую пару несёте мне баночку кильки.`;

export async function addGuessGame(bot: TelegramBot) {
  globalBotCommands.push({ command: '/guess', description: 'Игра угадайка' });

  bot.on('message', async (msg) => {
    const chatId = msg.chat.id;

    if (msg.text === '/guess') {
      gameStates[chatId] = {
        startNumber: null,
        endNumber: null,
        areNumbersPicked: false,
      };

      // await bot.setMyCommands(gameBotCommands)

      await bot.sendMessage(chatId, 'Хоотите поиграть? Ну чтож...вот правила:');
      await bot.sendMessage(chatId, gameRules, {
        reply_markup: {
          inline_keyboard: [[{ text: 'Сдаться', callback_data: 'msg_giveup' }]],
        },
      });
    }
  });

  bot.on('callback_query', async (msg) => {
    const chatId = msg.message?.chat.id
    if (!chatId) {
      console.error('No chat id!')
      return
    }
    if (msg.data === 'msg_giveup') {
      await bot.sendMessage(chatId, 'Ха-ха-ха! Ты проиграл!');
      await bot.setMyCommands(globalBotCommands);
      delete gameStates[chatId];
    }
    bot.answerCallbackQuery(msg.id)
  });
}
