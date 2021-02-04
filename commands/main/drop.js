const { MessageEmbed } = require('discord.js');
const {
  NAME,
  BUILD
} = require('../../config.json');

module.exports = {
  name: 'drop',
  aliases: ['delete', 'dr'],
  category: 'main',
  description: 'menghapus musik tertentu yang ada di daftar queue',
  usage: 'dr',
  run: async (client, message, args) => {
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

    if (!args[0]) {
      embed.setTitle("Lagu Tidak Ditemukan");
      embed.setDescription(`**${message.member.displayName}**, Harap masukkan nomor queue yang ingin dihapus!`);
      return message.channel.send(embed);
    }

    if (isNaN(args[0])) {
      embed.setTitle("Permissions Ditolak");
      embed.setDescription(`**${message.member.displayName}**, harap masukkan nomor queue dengan nilai angka`);
      return message.channel.send(embed);
    }

    if (args[0] > serverQueue.songs.length) {
      embed.setTitle("Lagu Tidak Ditemukan");
      embed.setDescription(`**${message.member.displayName}**, jumlah queue saat ini: ${serverQueue.songs.length}`);
      message.channel.send(embed);
    }

    serverQueue.songs.splice(args[0] - 1, 1);
    embed.setTitle("Queue Dropped");
    embed.setDescription(`**${message.member.displayName}**, berhasil menghapus queue`);
    return message.channel.send(embed);
  }
}