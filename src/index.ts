import * as TelegramBot from 'node-telegram-bot-api';
import { globalBotCommands } from './commands';
import { addFisherloverGreeting } from './modes/fishlover-greeting/fishlover-greeting';
import { addGuessGame } from './modes/guess-game/guess-game';
import * as dotenv from 'dotenv';
import { setupToken } from './core/setupToken';

dotenv.config();

setupToken();
const bot = new TelegramBot(process.env.TELEGRAM_TOKEN!, { polling: true });

addFisherloverGreeting(bot);
addGuessGame(bot);

bot.setMyCommands(globalBotCommands);
