const ytdl = require('ytdl-core');
const {
  Client,
  MessageEmbed
} = require('discord.js');
const {
  NAME,
  BUILD,
  QUEUE_LIMIT
} = require('../config.json');
const { Player } = require('discord-music-player');
const client = new Client();
const player = new Player(client, {
  leaveOnEmpty: false,
  leaveOnEnd: false
});

module.exports = {
  async play (song, message) {
    const queue = message.client.queue.get(message.guild.id);
    let embed = new MessageEmbed()
      .setColor(0xffed2a)
      .setTimestamp()
      .setFooter(`${NAME} | ${BUILD}`, message.client.user.displayAvatarURL());

    if (!song) {
      queue.channel.leave();
      message.client.queue.delete(message.guild.id);
      embed.setTitle("Lagu Tidak Ditemukan");
      embed.setDescription(`**${message.member.displayName}**, Lagu yang Anda masukkan tidak tersedia!`);
      return queue.textChannel
        .send(embed)
        .catch(console.error);
    }
    try {
      var stream = await ytdl(song.url, {
        highWaterMark: 1 << 25
      });
    } catch (err) {
      if (queue) {
        queue.songs.shift();
        module.exports.play(queue.songs[0], message);
      }

      if (err.message.includes === "copyright") {
        embed.setTitle("Lagu Tidak Ditemukan")
        embed.setDescription(`**${message.member.displayName}**, Lagu yang Anda cari berisi konten Copyright!`);
        return message.channel.send(embed);
      } else {
        console.log(err);
      }
    }

    const dispatcher = queue.connection
      .play(stream)
      .on("finish", () => {
        if (queue.loop) {
          let lastSong = queue.songs.shift();
          queue.song.push(lastSong);
          module.exports.play(queue.songs[0], message);
        } else {
          queue.songs.shift();
          module.exports.play(queue.songs[0], message);
        }
      })
      .on("error", console.error);

    dispatcher.setVolumeLogarithmic(queue.volume / 100);
    embed.setTitle("Playing Music");
    embed.setDescription(`**[${song.title}](${song.url})**`);

    queue.textChannel.send(embed);
  }
}