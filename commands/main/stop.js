const { MessageEmbed } = require('discord.js');
const {
  NAME,
  BUILD
} = require('../../config.json');

module.exports = {
  name: 'stop',
  aliases: ['st', 'end'],
  category: 'main',
  description: 'matiin musik yang lagi diputar',
  usage: 'st',
  run: async (client, message) => {
    const { channel } = message.member.voice;
    let embed = new MessageEmbed()
      .setColor(0xffed2a)
      .setTimestamp()
      .setFooter(`${NAME} | ${BUILD}`, client.user.displayAvatarURL());
    
    if (!channel) {
      embed.setTitle("Permissions Ditolak");
      embed.setDescription(`**${message.member.displayName}**, Masuk VC dulu dong bos.`);
      return message.channel.send(embed);
    }

    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue) {
      embed.setTitle("Lagu Tidak Ditemukan")
      embed.setDescription(`**${message.member.displayName}**, Ga ada lagu yang lagi diputar bang.`);
      return message.channel.send(embed);
    }

    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
  }
}