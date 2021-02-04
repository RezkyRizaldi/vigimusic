const { MessageEmbed } = require('discord.js');
const {
  NAME,
  BUILD
} = require('../../config.json');

module.exports = {
  name: 'disconnect',
  aliases: ['dc', 'leave'],
  category: 'main',
  description: 'Disconnect bot dari Voice Channel',
  usage: 'dc',
  run: async (client, message) => {
    const channel = message.member.voice.channel
    let embed = new MessageEmbed()
      .setColor(0xffed2a)
      .setTimestamp()
      .setFooter(`${NAME} | ${BUILD}`, client.user.displayAvatarURL())
      
    if (!channel) {
      embed.setDescription(`**${message.member.displayName}**, Masuk VC dulu dong bos.`);
      return message.channel.send(embed);
    }

    embed.setTitle("BOT Disconnected");
    return message.channel.send(embed).then(() => channel.leave());
  }
}