const { MessageEmbed } = require('discord.js');
const {
  NAME,
  BUILD
} = require('../config.json');

module.exports = {
  name: 'resume',
  description: 'Ngeresume musik yang lagi dipause',
  execute(client, message, args) {
    const { channel } = message.member.voice;
    let embed = new MessageEmbed()
      .setColor(0xffed2a)
      .setTimestamp()
      .setFooter(`${NAME} | ${BUILD}`, client.user.displayAvatarURL());

    if (!channel) {
      embed.setDescription(`**${message.member.displayName}**, Masuk VC dulu dong bos.`);
      return message.channel.send(embed);
    }

    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue) {
      embed.setDescription(`**${message.member.displayName}**, Ga ada musik yang lagi diputar bang.`);
      return message.channel.send(embed);
    }

    if (serverQueue && !serverQueue.playing) {
      serverQueue.playing = true;
      serverQueue.connection.dispatcher.resume();

      embed.setTitle("Music Resumed")
      embed.setDescription("Gas lagi gan");
      return message.channel.send(embed);
    }
  }
}