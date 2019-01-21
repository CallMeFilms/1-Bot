// #####################
// Module exports
// ####################
module.exports = {
  // ####################
  // Command Handler
  // ####################
  handle: async function(msg, sender, channel, command, args) {
    var mutedRole = channel.guild.roles.find(role => role.name.toLowerCase() === "muted");
    var allowedToMute = false;
    await channel.guild.fetchMember(sender).then(function(member) {
      if(member.roles.find(role => role.name.toLowerCase() === "moderator" || role.name.toLowerCase() === "admin" || role.name === role.name.toLowerCase() === "superkey")) {
        allowedToMute = true;
      }
    });
    if(!allowedToMute) {
      channel.send("You are not allowed to use that command");
      return;
    }
    if(!mutedRole) {
      channel.send(channel.guild.name + " does not have a `muted` role.");
      return;
    }
    if(args.length < 1) {
      channel.send("Please specify a user to mute and a mute time.");
      return;
    }
    const member = channel.guild.members.find(member => member.user.username === args[0] || member.user.toString() === args[0]);
    if(!member) {
      channel.send("Could not find user " + args[0]);
      return;
    }
    if(member.user.bot) {
      channel.send("You can not mute a bot");
      return;
    }
    if(args.length < 2) {
      channel.send("Please specify an amount of time to mute " + member.user.username + "#" + member.user.discriminator);
      return;
    }
    if(!(/^(([1-9]{1,3}|[1-9]{1,3}\.([0-9][1-9]|[1-9]|[1-9][0-9]))|([0-9]\.([0-9][1-9]|[1-9]|[1-9][0-9])))(s|m|h)$/.test(args[1]))) {
      channel.send("1 Please specify a valid amount of time to mute " + member.user.username + "#" + member.user.discriminator);
      return;
    }
    var time = parseFloat(args[1].replace(/s|m|h/, ""));
    if(isNaN(time)) {
      channel.send("Please specify a valid amount of time to mute " + member.user.username + "#" + member.user.discriminator);
      return;
    }
    var timeType = args[1].split("").splice(args[1].length - 1).join("");
    await member.addRole(mutedRole).then(function(member) {
      var multiplier;
      switch(timeType) {
        case "s":
          multiplier = 1000;
          break;
        case "m":
          multiplier = 60000;
          break;
        case "h":
          multiplier = 3600000;
          break;
      }
      member.muted = setTimeout(function() {
        member.removeRole(mutedRole);
      }, time * multiplier);
    });
    channel.send((channel.guild.emojis.find(emoji => emoji.name === "agree") || ":white_check_mark:") + " ***Muted " + member.user.username + "#" + member.user.discriminator + " for " + time + timeType + "***");
  }
}