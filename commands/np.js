const { MessageEmbed } = require('discord.js');
const {
  NAME,
  BUILD
} = require('../config.json');

module.exports = {
  name: 'np',
  description: 'Cek daftar lagu yang sedang diputar',
  execute(client, message) {
    const { channel } = message.member.voice;
    let embed = new MessageEmbed()
      .setColor(0xffed2a)
      .setTimestamp()
      .setFooter(`${NAME} | ${BUILD}`, client.user.displayAvatarURL());

    if (!channel) {
      embed.setTitle("Permissions Ditolak")
      embed.setDescription(`**${message.member.displayName}**, Masuk VC dulu dong bos.`);
      return message.channel.send(embed);
    }

    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue) {
      embed.setTitle("Lagu Tidak Ditemukan");
      embed.setDescription(`**${message.member.displayName}**, BOTnya lagi nganggur`);
      return message.channel.send(embed);
    }

    embed.setTitle("NOW PLAYING");
    embed.setDescription(`${serverQueue.songs[0].title}`);
    embed.setThumbnail(serverQueue.songs[0].thumbnail);
    return message.channel.send(embed);
  }
}