import { insertUser } from './database.js';

/**
 * @param {TelegramBot} bot - The instance of the Telegram bot
 * @param {number} chatId - The ID of the chat 
 * @param {number} groupId - The ID of the Telegram group
 */
const registerUser = (bot, chatId, groupId) => {
    // get user name
    bot.sendMessage(chatId, "Please enter your name:");

    //  Listen for the user's response containing their name
    bot.once('message', (msg) => {
        const name = msg.text;

        //get user for their email.
        bot.sendMessage(chatId, "Please enter your email:");

        //Listen for the user's response containing their email.
        bot.once('message', (msg) => {
            const email = msg.text;

            //Ask the user how many tickets they would like.
            bot.sendMessage(chatId, "How many tickets would you like?");


            bot.once('message', (msg) => {
                const tickets = parseInt(msg.text);
                const userId = msg.from.id;

                //Insert the user registration information 
                insertUser(name, email, tickets, userId, (err, ticketId) => {
                    if (err) {
                        //Handle any errors that occur during the insertion.
                        bot.sendMessage(chatId, "There was an error processing your request. Please try again.");
                        return;
                    }

                    //Confirm the user's registration 
                    bot.sendMessage(chatId, `Thank you ${name}! You have successfully requested ${tickets} ticket(s). Your ticket ID is ${ticketId}.`);

                    //Check if the user is already a member of the event group
                    bot.getChatMember(groupId, userId).then((member) => {
                        if (member.status === 'left' || member.status === 'kicked') {
                            //If user is not in the group, send an invite link
                            bot.sendMessage(chatId, "Adding you to the event group...");
                            bot.exportChatInviteLink(groupId).then((inviteLink) => {
                                bot.sendMessage(chatId, `Join the event group here: ${inviteLink}`);
                            });
                        } else {
                            //If  user is already in the group 
                            bot.sendMessage(chatId, "You are already a member of the event group.");
                        }
                    });
                });
            });
        });
    });
};

export { registerUser };
