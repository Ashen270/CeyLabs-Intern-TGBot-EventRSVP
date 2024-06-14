const { insertUser } = require('./database');

const registerUser = (bot, chatId) => {
    bot.sendMessage(chatId, "Please enter your name:");
    bot.once('message', (msg) => {
        const name = msg.text;
        bot.sendMessage(chatId, "Please enter your email:");
        bot.once('message', (msg) => {
            const email = msg.text;
            bot.sendMessage(chatId, "How many tickets would you like?");
            bot.once('message', (msg) => {
                const tickets = parseInt(msg.text);
                const userId = msg.from.id;

                insertUser(name, email, tickets, userId, (err, ticketId) => {
                    if (err) {
                        bot.sendMessage(chatId, "There was an error processing your request. Please try again.");
                        return;
                    }

                    bot.sendMessage(chatId, `Thank you ${name}! You have successfully requested ${tickets} ticket(s). Your ticket ID is ${ticketId}.`);
                    bot.getChatMember(groupId, userId).then((member) => {
                        if (member.status === 'left' || member.status === 'kicked') {
                            bot.sendMessage(chatId, "Adding you to the event group...");
                            bot.exportChatInviteLink(groupId).then((inviteLink) => {
                                bot.sendMessage(chatId, `Join the event group here: ${inviteLink}`);
                            });
                        } else {
                            bot.sendMessage(chatId, "You are already a member of the event group.");
                        }
                    });
                });
            });
        });
    });
};

module.exports = {
    registerUser
};
