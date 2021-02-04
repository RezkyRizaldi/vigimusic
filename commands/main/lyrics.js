const { MessageEmbed } = require('discord.js');
const Genius = new require('genius-lyrics');
const Client = new Genius.Client("ZD_lLHBwRlRRfQvVLAnHKHksDHQv9W1wm1ZAByPaYo1o2NuAw6v9USBUI1vEssjq");
const {
  NAME,
  BUILD
} = require('../../config.json');

module.exports = {
  name: 'lyrics',
  aliases: ['ly'],
  category: 'main',
  description: 'Liat lirik musik yang lagi diputar',
  usage: 'ly <title>',
  run: async (client, message, args) => {
    const { channel } = message.member.voice;
    let embed = new MessageEmbed()
      .setColor(0xffed2a)
      .setTimestamp()
      .setDescription("Sedang mencari lirik, harap tunggu...")
      .setFooter(`${NAME} | ${BUILD}`, client.user.displayAvatarURL());
    
    if (!args.length) {
      embed.setTitle("Lagu Tidak Ditemukan")
      embed.setDescription(`**${message.member.displayName}**, Harap masukkan judul lagu yang ingin dicari liriknya!`);
      return message.channel.send(embed);
    }

    if (!channel) {
      embed.setTitle("Permissions Ditolak");
      embed.setDescription(`**${message.member.displayName}**, Masuk VC dulu dong bos.`);
      return message.channel.send(embed);
    }

    const msg = await message.channel.send(embed);
    try {
      const searches = await Client.songs.search(args.join(" "));
      const lyrics = await searches[0].lyrics();

      if (lyrics.length > 4095) {
        msg.delete();
        embed.setTitle("Permissions Ditolak");
        embed.setDescription(`**${message.member.displayName}**, Lirik terlalu panjang.`);
        return message.channel.send(embed);
      }

      if (lyrics.length < 2048) {
        const lyricsEmbed = new MessageEmbed()
          .setColor(0xffed2a)
          .setTimestamp()
          .setDescription(lyrics.trim())
          .setFooter(`${NAME} | ${BUILD}`, client.user.displayAvatarURL());
        return msg.edit(lyricsEmbed);
      } else {
        const firstLyricsEmbed = new MessageEmbed()
          .setColor(0xffed2a)
          .setTimestamp()
          .setDescription(lyrics.slice(0, 2048))
          .setFooter(`${NAME} | ${BUILD}`, client.user.displayAvatarURL());
        const secondLyricsEmbed = new MessageEmbed()
          .setColor(0xffed2a)
          .setTimestamp()
          .setDescription(lyrics.slice(2048, lyrics.length))
          .setFooter(`${NAME} | ${BUILD}`, client.user.displayAvatarURL());
        msg.edit(firstLyricsEmbed);
        return message.channel.send(secondLyricsEmbed);
      }
    } catch (err) {
      console.log(err);
      embed.setDescription(`Error: ${err}`);
      msg.edit(embed);
    }
  }
}