const addUserToGroup = (bot, chatId, userId, groupId) => {
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
};

module.exports = {
    addUserToGroup
};
