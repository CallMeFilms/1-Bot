// ####################
// Module Exports
// ####################
module.exports = {
  // ####################
  // Command Handler
  // ####################
  handle: function(msg, sender, channel, command, args) {
    var command = msg.content.split(" ")[0].split("").splice(1).join("");
    var args = msg.content.split(" ").splice(1);
    var curMilliseconds = new Date().getTime();
    var pingTime = msg.createdAt - curMilliseconds;
    channel.send("Pong **" + pingTime + "ms**");
  }
}