const { MessageEmbed } = require('discord.js');
const {
  NAME,
  BUILD
} = require('../config.json');

module.exports = {
  name: 'jump',
  description: 'lompat ke musik yang ada di daftar queue',
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

    if (!args[0]) {
      embed.setTitle("Lagu Tidak Ditemukan");
      embed.setDescription(`**${message.member.displayName}**, Harap masukkan nomor queue yang ingin dituju!`);
      return message.channel.send(embed);
    }

    if (isNaN(args[0])) {
      embed.setTitle("Permissions Ditolak");
      embed.setDescription(`**${message.member.displayName}**, harap masukkan nomor queue dengan nilai angka`);
      return message.channel.send(embed);
    }

    if (serverQueue.songs.length < args[0]) {
      embed.setTitle("Lagu Tidak Ditemukan");
      embed.setDescription(`**${message.member.displayName}**, jumlah queue saat ini: ${serverQueue.songs.length}`);
      return message.channel.send(embed);

      // if (args[0].substr(args[0].length - 1) === "1") {
      //   args[0].concat("st");
      // } else if (args[0].substr(args[0].length - 1) === "2") {
      //   args[0].concat("nd");
      // } else if (args[0].substr(args[0].length - 1) === "3") {
      //   args[0].concat("rd");
      // } else {
      //   args[0].concat("th");
      // }

    }
    
    serverQueue.songs.splice(0, Math.floor(parseInt(args[0]) - 1));
    serverQueue.connection.dispatcher.end();
    embed.setTitle("Jump Music");
    embed.setDescription(`Lompat menuju musik ke-${args[0]} dari daftar queue`);
    return message.channel.send(embed);
  }
}