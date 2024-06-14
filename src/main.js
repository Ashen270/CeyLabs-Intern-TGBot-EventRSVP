const TelegramBot = require('node-telegram-bot-api');
const { getEventInfo } = require('./utils/event_info');
const { registerUser } = require('./utils/registration');
const config = require('./config');
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
    registerUser(bot, chatId);
});

// Help command
bot.onText(/\/help/, (msg) => {
    bot.sendMessage(msg.chat.id, "Use /start to get event details and /register to request free tickets.");
});
