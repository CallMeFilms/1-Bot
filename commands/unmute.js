// ####################
// Module Exports
// ####################
module.exports = {
  // ####################
  // Command Handler
  // ####################
  handle: async function(msg, sender, channel, command, args) {
    var mutedRole = channel.guild.roles.find(role => role.name.toLowerCase() === "muted");
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
      channel.send("Please specify a user to unmute.");
      return;
    }
    const member = channel.guild.members.find(member => member.user.username === args[0] || member.user.toString() === args[0]);
    if(!member) {
      channel.send("Could not find user " + args[0]);
      return;
    }
    if(member.user.bot) {
      channel.send("You can not mute/unmute a bot");
      return;
    }
    if(!member.roles.get(mutedRole.id)) {
      channel.send(member.user.username + "#" + member.user.discriminator + " is not muted");
      return;
    }
    member.removeRole(mutedRole);
    member.muted = null;
    channel.send(channel.guild.emojis.find(emoji => emoji.name === "agree") + " ***Unmuted " + member.user.username + "#" + member.user.discriminator + "***");
  }
}