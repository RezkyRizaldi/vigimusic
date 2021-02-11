const { readdirSync } = require('fs');
const ascii = require('ascii-table');
let table = new ascii("Events");
table.setHeading("Events", "Load Status");

module.exports = (client) => {
  const commands = readdirSync('./events/').filter(file => file.endsWith(".js"));

  for (let file of commands) {
    try {
      let pull = require(`../events/${file}`);

      if (pull.event && typeof pull.event !== "string") {
        table.addRow(file.replace(".js", ""), '❌');
        continue;
      }

      pull.event = pull.event || file.replace(".js", "");
      client.on(pull.event, pull.run.bind(null, client));
      table.addRow(file.replace(".js", ""), '✅');
    } catch (err) {
      console.log("Error saat meload file");
      console.log(err);
      table.addRow(file.replace(".js", ""), '❌');
    }
  }
  console.log(table.toString());
}