const { MessageEmbed } = require('discord.js');
const {
  NAME,
  BUILD
} = require('../../config.json');

module.exports = {
  name: 'loopqueue',
  aliases: ['lq', 'loop'],
  category: 'main',
  description: 'loop musik yang lagi diputar',
  usage: 'lq',
  run: async (client, message) => {
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

    serverQueue.loop = !serverQueue.loop;
    embed.setTitle(`Music ${serverQueue.loop ? "Looped" : "Disabled"}`);
    embed.setDescription(`Loop ${serverQueue.loop ? "Nyala" : "Mati"}`);
    return message.channel.send(embed);
  }
}