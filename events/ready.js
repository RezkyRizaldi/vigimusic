const {
  PREFIX,
  NAME,
  BUILD
} = require('./../config.json');

module.exports.run = async (client) => {
  console.log(`${NAME} ${BUILD} hurung bos!`);
  client.user.setActivity(`[${PREFIX}music] | ${BUILD}`, {
    type: "PLAYING"
  }).catch(console.error);
}