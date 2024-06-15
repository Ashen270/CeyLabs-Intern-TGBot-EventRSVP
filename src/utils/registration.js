import { insertUser } from './database.js';
const userStates = {};
/**
 * Function to handle the user registration process.
 * @param {TelegramBot} bot The Telegram bot instance.
 * @param {number} chatId The chat ID of the user.
 * @param {number} groupId The ID of the group to which users are being registered.
 */
const registerUser = (bot, chatId, groupId) => {
    // Initialize the user's state
    userStates[chatId] = { step: 'name' };
    bot.sendMessage(chatId, "Please enter your name:");
    // Listen for incoming messages
    const messageHandler = (msg) => {
        // Ensure the message is from the same chat
        if (msg.chat.id !== chatId) return;
        const userState = userStates[chatId];
        if (!userState) return;
        switch (userState.step) {
            case 'name':
                userState.name = msg.text;
                userState.step = 'email';
                bot.sendMessage(chatId, "Please enter your email:");
                break;

            case 'email':
                userState.email = msg.text;
                userState.step = 'tickets';
                bot.sendMessage(chatId, "How many tickets would you like?");
                break;

            case 'tickets':
                userState.tickets = parseInt(msg.text);
                userState.userId = msg.from.id;

                // Insert the user into the database
                insertUser(userState.name, userState.email, userState.tickets, userState.userId, (err, ticketId) => {
                    if (err) {
                        bot.sendMessage(chatId, "There was an error processing your request. Please try again.");
                        // Clear state on error
                        delete userStates[chatId];
                        return;
                    }

                    // Send a confirmation message to the user
                    bot.sendMessage(chatId, `Greetings ${userState.name}! You have successfully requested ${userState.tickets} ticket(s). Your ticket ID is ${ticketId}.`);

                    // Check if the user is already a member of the group
                    bot.getChatMember(groupId, userState.userId).then((member) => {
                        if (member.status === 'left' || member.status === 'kicked') {
                            bot.sendMessage(chatId, "Adding you to the event group...");
                            bot.exportChatInviteLink(groupId).then((inviteLink) => {
                                bot.sendMessage(chatId, `Join the event group here: ${inviteLink}`);
                            });
                        } else {
                            bot.sendMessage(chatId, "You are already a member of the event group.");
                        }
                    }).finally(() => {
                        delete userStates[chatId];
                    });
                });
                break;
            default:
                bot.sendMessage(chatId, "There was an error processing your request. Please try again.");
                delete userStates[chatId];
                break;
        }
    };
    bot.on('message', messageHandler);
    userStates[chatId].cleanup = () => bot.removeListener('message', messageHandler);
};

export { registerUser };
