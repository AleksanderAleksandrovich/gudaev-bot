import TelegramBot from "node-telegram-bot-api";
import { GuessGameMessage } from "./guess-game.types";

export const gameInstruction = `Вы выбираете два числа, между которыми я загаю вам своё число. Ваша задача - угадать, какое число я загадал. Если вы будете тупить - на следующую пару несёте мне баночку кильки. А пока - выберите уровень сложности...`;

export const DIFFICULTY_KEYBOARD: {
  text: string;
  callback_data: GuessGameMessage;
}[][] = [
  [
    {
      text: 'Проще паренной репы. Ха-ха нуб. (0-10)',
      callback_data: 'msg_guess_game_difficulty_1',
    },
  ],
  [
    {
      text: 'На поясочек (0-100)',
      callback_data: 'msg_guess_game_difficulty_2',
    },
  ],
  [
    {
      text: 'Килько-мастер колбастер (0-1000)',
      callback_data: 'msg_guess_game_difficulty_3',
    },
  ],
];

export const gameOptions = {
  reply_markup: {
    inline_keyboard: [[{ text: 'Сдаться', callback_data: 'msg_guess_game_giveup' }]],
  },
};

export const gameBotCommands: TelegramBot.BotCommand[] = [
  {
    command: '/exit',
    description: 'Сдаться и потратить банку вкуснейшей кильки',
  },
];