const { MessageEmbed } = require('discord.js');
const {
  NAME,
  BUILD
} = require('../../config.json');

module.exports = {
  name: 'skip',
  aliases: ['s'],
  category: 'main',
  description: 'skip musik yang lagi diputar',
  usage: 's',
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
    const vote = message.client.vote.get(message.guild.id);
    if (!serverQueue) {
      embed.setTitle("Lagu Tidak Ditemukan")
      embed.setDescription(`**${message.member.displayName}**, Ga ada lagu yang lagi diputar bang.`);
      return message.channel.send(embed);
    }

    const voter = message.guild.me.voice.channel.members.size;
    const voteVC = Math.floor(voter / 2);
    const agree = Math.floor(voter / 2 - 1);

    if (!message.member.hasPermission("ADMINISTRATOR")) {
      if (vote.vote > agree) {
        serverQueue.connection.dispatcher.end();
        embed.setTitle("Music Skipped")
        // embed.setDescription(`**${message.member.displayName}**, Ga ada lagu yang lagi diputar bang.`);
        return message.channel.send(embed);
      }

      if (vote.voters.includes(message.author.id)) {
        embed.setDescription(`**${message.member.displayName}**, Anda sudah melakukan vote!`);
        return message.channel.send(embed);
      }

      if (voteVC === 2) {
        serverQueue.connection.dispatcher.end();
        embed.setTitle("Music Skipped")
        return message.channel.send(embed);
      }

      vote.vote++;
      vote.voters.push(message.author.id);
      embed.setDescription(`**${message.member.displayName}**, Anda berhasil melakukan vote, butuh ${Math.floor(voteVC - vote.vote)} voters`);
      return message.channel.send(embed);
    }

    serverQueue.connection.dispatcher.end();
    embed.setTitle("Music Skipped")
    return message.channel.send(embed);
  }
}