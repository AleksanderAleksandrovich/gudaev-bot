import * as TelegramBot from 'node-telegram-bot-api';
import { getRandomInt } from '../../core/utils/numbers';
import { globalBotCommands } from '../../commands';
import { Difficulty, GameState, GuessGameMessage } from './guess-game.types';
import {
  DIFFICULTY_KEYBOARD,
  gameInstruction,
  gameOptions,
} from './guess-game.constants';

const gameStates: Record<string, GameState> = {};

let bot: TelegramBot;

export async function addGuessGame(botArg: TelegramBot) {
  bot = botArg;
  globalBotCommands.push({ command: '/guess', description: 'Игра угадайка' });

  bot.on('message', handleMessageEvent);
  bot.on('callback_query', handleCallbackQuery);
}

async function handleGame(
  chatId: number,
  message: TelegramBot.Message,
) {
  const currentGameState = gameStates[chatId];

  if (!message.text) throw new Error(`Text is undefined!`);

  const guessNumber = Number.parseInt(message.text);

  if (Number.isNaN(guessNumber)) {
    bot.sendMessage(
      chatId,
      'А это не цифра...я для тебя что, шутка?',
      gameOptions,
    );
    return;
  }

  if (currentGameState?.answerNumber === null)
    throw new Error(`Can't define answer number!`);

  await handleAnswerNumberCheck(chatId, guessNumber, currentGameState?.answerNumber);
}

function defineGuessRangeByDifficulty(difficultyNumber: Difficulty) {
  switch (difficultyNumber) {
    case 1:
      return [1, 10];
    case 2:
      return [1, 100];
    case 3:
      return [1, 1000];
    default:
      throw new Error(`There is no such difficulty!`);
  }
}

async function handleMessageEvent(msg: TelegramBot.Message) {
  const chatId = msg.chat.id;

  // We're trying to start a new game
  if (msg.text === '/guess') {    
    await prepareToGameStart(chatId);
    return;
  }

  const gameIsStarted = gameStates[chatId]?.difficulty !== null;
  if (gameIsStarted) {
    await handleGame(chatId, msg);
    return;
  }
}

async function handleCallbackQuery(callbackQuery: TelegramBot.CallbackQuery) {
  const chatId = callbackQuery.message?.chat.id;
  if (!chatId) {
    console.error('No chat id!');
    return;
  }

  const typesMessageData = callbackQuery.data as GuessGameMessage;

  switch (typesMessageData) {
    case 'msg_guess_game_giveup': {
      await bot.sendMessage(chatId, 'Ха-ха-ха! Ты проиграл!');
      delete gameStates[chatId];
      break;
    }
    case 'msg_guess_game_difficulty_1': {
      await bot.sendMessage(chatId, 'Ну давай, малёк. Поехали.');
      gameStates[chatId].difficulty = 1;// need to check if the state exists 
      gameGuessStart(1, chatId);
      break;
    }
    case 'msg_guess_game_difficulty_2': {
      await bot.sendMessage(chatId, 'Неплохо, креветочка. Начинаем!');
      gameStates[chatId].difficulty = 2;// need to check if the state exists too
      gameGuessStart(2, chatId);
      break;
    }
    case 'msg_guess_game_difficulty_3': {
      await bot.sendMessage(
        chatId,
        'Ты заставляешь мой рыбий жирок трястись! Не разочаруй меня!',
      );
      gameStates[chatId].difficulty = 3;// need to check if the state exists too
      gameGuessStart(3, chatId);
      break;
    }
  }

  await bot.answerCallbackQuery(callbackQuery.id);
}

function gameGuessStart(difficultyLevel: Difficulty, chatId: number) {
  const [startNumber, endNumber] =
    defineGuessRangeByDifficulty(difficultyLevel);
  const answerNumber = getRandomInt(startNumber, endNumber);
  gameStates[chatId].answerNumber = answerNumber;
}

function resetGameState(chatId: number) {
  gameStates[chatId] = {
    difficulty: null,
    answerNumber: null,
  };
}

function removeGameState(chatId: number) {
  delete gameStates[chatId];
}

async function showGameIntroduction(chatId: number) {
  await bot.sendMessage(chatId, 'Хоотите поиграть? Ну чтож...вот правила:')
  await bot.sendMessage(chatId, gameInstruction)
}

async function showChooseDifficultyKeyboard(chatId: number) {
  await bot.sendMessage(chatId, "Насколько большую рыбку ты готов проглотить?", {
    reply_markup: {
      inline_keyboard: DIFFICULTY_KEYBOARD,
    },
  });
}

async function handleAnswerNumberCheck(chatId: number, guessNumber: number, answerNumber: number) {
  if (guessNumber === gameStates[chatId]?.answerNumber) {
    await winTheGame(chatId);
    return;
  } else if (guessNumber < answerNumber) {
    bot.sendMessage(chatId, 'Ммм...я бы взял побольше...', gameOptions);
    return;
  } else if (guessNumber > answerNumber) {
    bot.sendMessage(chatId, 'Ммм...я бы взял поменьше...', gameOptions);
    return;
  }
}

async function prepareToGameStart(chatId: number) {
  resetGameState(chatId)
  await showGameIntroduction(chatId);
  await showChooseDifficultyKeyboard(chatId);
}

async function winTheGame(chatId: number) {
  await bot.sendMessage(
  chatId,
  'О нет...вы меня одолели! Абсолютно правильно! Заветная баночка ваша!',
);
  removeGameState(chatId);
}
