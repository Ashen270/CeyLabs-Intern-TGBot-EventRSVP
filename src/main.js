import TelegramBot from 'node-telegram-bot-api';
import { getEventInfo } from './utils/event_info';
import { registerUser } from './utils/registration';
import config from './config.json';

const TOKEN = config.token;
const bot = new TelegramBot(TOKEN, { polling: true });
const groupId = config.groupId;

// Start command
bot.onText(/\/start/, (msg) => {
    const eventInfo = getEventInfo();
    bot.sendMessage(msg.chat.id, eventInfo);
});

// Register command
bot.onText(/\/register/, (msg) => {
    const chatId = msg.chat.id;
    registerUser(bot, chatId, groupId);
});

// Help command
bot.onText(/\/help/, (msg) => {
    bot.sendMessage(msg.chat.id, "Use /start to get event details and /register to request free tickets.");
});
