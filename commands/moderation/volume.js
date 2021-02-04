const { MessageEmbed } = require('discord.js');
const {
  NAME,
  BUILD
} = require('../../config.json');

module.exports = {
  name: 'volume',
  aliases: ['vl'],
  category: 'moderation',
  description: 'Ngatur volume musik yang lagi diputar',
  usage: 'vl <amount>',
  run: async (client, message, args) => {
    const { channel } = message.member.voice;
    let embed = new MessageEmbed()
      .setColor(0xffed2a)
      .setTimestamp()
      .setFooter(`${NAME} | ${BUILD}`, client.user.displayAvatarURL());
    
    if (!message.member.hasPermission("ADMINISTRATOR")) {
      embed.setTitle("Permissions Ditolak");
      embed.setDescription(`**${message.member.displayName}**, Anda tidak memiliki perms untuk mengakses fitur ini!`);
      return message.channel.send(embed);
    }
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

    if (!args[0]) {
      embed.setDescription(`Volume musik yang diputar saat ini: ${serverQueue.volume}`);
      return message.channel.send(embed);
    }

    if (isNaN(args[0])) {
      embed.setTitle("Permissions Ditolak")
      embed.setDescription(`**${message.member.displayName}**, harap masukkan volume yang ingin diatur dengan nilai angka`);
      return message.channel.send(embed);
    }

    if (args[0] >= 200) {
      embed.setDescription(`**${message.member.displayName}**, Budeg bangsyat!`);
      return message.channel.send(embed);
    }

    serverQueue.volume = args[0];
    serverQueue.connection.dispatcher.setVolumeLogarithmic(args[0] / 100);
    embed.setDescription(`Volume di set menjadi ${args[0]}`);
    return message.channel.send(embed);
  }
}