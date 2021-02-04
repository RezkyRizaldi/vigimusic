const { MessageEmbed } = require('discord.js');
const {
  NAME,
  BUILD,
  YOUTUBE_API_KEY,
  QUEUE_LIMIT
} = require('../../config.json');
const ytdl = require('ytdl-core');
const YoutubeAPI = require('simple-youtube-api');
const youtube = new YoutubeAPI(YOUTUBE_API_KEY);
const { play } = require('../../system/music');

module.exports = {
  name: "play",
  aliases: ["p"],
  category: 'main',
  description: "Mainin music",
  usage: "p <title>",
  run: async (client, message, args) => {
    let embed = new MessageEmbed()
      .setColor(0xffed2a)
      .setTimestamp()
      .setFooter(`${NAME} | ${BUILD}`, client.user.displayAvatarURL());

    if (!args.length) {
      embed.setTitle("Lagu Tidak Ditemukan")
      embed.setDescription(`**${message.member.displayName}**, Harap masukkan judul lagu yang ingin diputar!`);
      return message.channel.send(embed);
    }

    const { channel } = message.member.voice;

    if (!channel) {
      embed.setDescription(`**${message.member.displayName}**, Masuk VC dulu dong bos.`);
      return message.channel.send(embed);
    }

    const targetSong = args.join(" ");
    const videoPattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
    const playlistPattern = /^.*(youtu.be\/|list=)([^#\&\?]*).*/gi;
    const urlCheck = videoPattern.test(args[0]);

    if (!urlCheck && playlistPattern.test(args[0])) {
      embed.setTitle("Lagu Tidak Ditemukan")
      embed.setDescription(`**${message.member.displayName}**, URL yang Anda masukkan tidak tersedia!`);
      return message.channel.send(embed);
    }

    const serverQueue = message.client.queue.get(message.guild.id);

    const queueConstruct = {
      textChannel: message.channel,
      channel,
      connection: null,
      songs: [],
      loop: false,
      volume: 50,
      playing: true
    };

    const voteConstruct = {
      vote: 0,
      voters: []
    };

    let songData = null;
    let song = null;

    if (urlCheck) {
      try {
        songData = await ytdl.getInfo(args[0]);

        song = {
          title: songData.videoDetails.title,
          url: songData.videoDetails.video_url,
          duration: songData.videoDetails.lengthSeconds,
          thumbnail: songData.videoDetails.thumbnails[3].url
        };
      } catch (err) {
        if (message.include === "copyright") {
          embed.setTitle("Lagu Tidak Ditemukan")
          embed.setDescription(`**${message.member.displayName}**, Lagu yang Anda cari berisi konten Copyright!`);
          return message.channel.send(embed)
            .catch(console.log(err));
        } else {
          console.log(err);
        }
      }
    } else {
      try {
        const result = await youtube.searchVideos(targetSong, 1);
        songData = await ytdl.getInfo(result[0].url);

        song = {
          title: songData.videoDetails.title,
          url: songData.videoDetails.video_url,
          duration: songData.videoDetails.lengthSeconds,
          thumbnail: songData.videoDetails.thumbnails[3].url
        };
      } catch (err) {
        console.log(err);
        embed.setTitle("Lagu Tidak Ditemukan")
        embed.setDescription(`**${message.member.displayName}**, Error duh sial!`);
        return message.channel.send(embed);
      }
    }

    if (serverQueue) {
      if (serverQueue.songs.length > Math.floor(QUEUE_LIMIT - 1) && QUEUE_LIMIT !== 0) {
        embed.setTitle("Permisions Ditolak")
        embed.setDescription(`**${message.member.displayName}**, Ga bisa nambah lagu lebih dari ${QUEUE_LIMIT}`);
        return message.channel.send(embed);
      }

      serverQueue.songs.push(song);
      embed.setTitle(`**${message.member.displayName}**, Nambah Queue Baru`);
      embed.setDescription(`**[${song.title}](${song.url})**`);
      embed.setThumbnail(song.thumbnail);

      return serverQueue.textChannel
        .send(embed)
        .catch(console.error);
    } else {
      queueConstruct.songs.push(song);
    }

    if (!serverQueue) {
      message.client.queue.set(message.guild.id, queueConstruct);
      message.client.vote.set(message.guild.id, voteConstruct);
    }
    if (!serverQueue) {
      try {
        queueConstruct.connection = await channel.join();
        play(queueConstruct.songs[0], message);
      } catch (err) {
        console.log(err);
        message.client.queue.delete(message.guild.id);
        await channel.leave();
        return message.channel
          .send({
            embed: {
              title: "Permissions Ditolak",
              description: `**${message.member.displayName}**, Ga bisa Join VC euy.`
            }
          })
          .catch(console.log(err));
      }
    }
  }
}