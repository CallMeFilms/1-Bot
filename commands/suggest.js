// Import Discord module
const discord = require("discord.js");

// ####################
// Module Exports
// ####################
module.exports = {
  // ####################
  // Command Handler
  // ####################
  handle: async function(msg, sender, channel, command, args) {
    const suggestionsChannel = channel.guild.channels.find(chan => chan.name === "suggestions");
    if(!suggestionsChannel) {
      channel.send(channel.guild.name + " does not have a suggestions channel. This command is currently unavailable.");
      return;
    }
    if(args.length < 1) {
      channel.send("Please provide a suggestion.");
      return;
    }
    const suggestion = args.join(" ");
    const embed = new discord.RichEmbed().setColor(0x42f471).setDescription(suggestion).setFooter("User ID - " + msg.author.id);
    suggestionsChannel.createWebhook(msg.author.username, msg.author.avatarURL).then(webhook => {
      webhook.send(embed).then(async msg => {
        await msg.react((channel.guild.emojis.find(emoji => emoji.name === "agree") || ":white_check_mark:"));
        msg.react(channel.guild.emojis.find(emoji => emoji.name === "disagree"));
      }).then(() => {
        channel.send("Your suggestion has been sent to " + suggestionsChannel + ". Thank you!");
        webhook.delete();
      });
    });
  }
}