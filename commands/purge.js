// ####################
// Module Exports
// ####################
module.exports = {
  // ####################
  // Command Handler
  // ####################
  handle: async function(sender, channel, msg, command, args) {
    if(args.length < 1) {
      channel.send("Please specify a number of messages to purge.");
      return;
    }
    var number = parseInt(args[0]);
    if(isNaN(number)) {
      channel.send("Please specify a valid number of messages to purge.");
      return;
    } else if(number > 100) {
      channel.send("You can only purge up to 100 messages at a time.");
      return;
    }
    await msg.delete();
    channel.bulkDelete(number);
  }
}