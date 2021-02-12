const { MessageEmbed } = require('discord.js');
const {
  NAME,
  BUILD
} = require('../config.json');

module.exports = {
  name: 'pause',
  description: 'Ngepause musik yang lagi jalan',
  execute(client, message) {
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

    if (serverQueue && serverQueue.playing) {
      serverQueue.playing = false;
      serverQueue.connection.dispatcher.pause(true);

      embed.setTitle("Music Paused");
      embed.setDescription("Pause dulu gan");
      return message.channel.send(embed);
    }
  }
}