// Import discord module, config.json, and form Module
const discord = require("discord.js");
const config = require("../config.json");
const form = require("../form.js");

// #####################
// Module exports
// ####################
module.exports = {
  // ####################
  // Command Handler
  // ####################
  handle: async function(msg, sender, channel, command, args) {
    channel.send(channel.guild.emojis.find(emoji => emoji.name === "agree") + " ***The application form has been sent to your DM's.***");
    form.send(sender, config.forms.modapp.questions, { "title":"Moderator Application" }, (form) => {
      sender.send(channel.guild.emojis.find(emoji => emoji.name === "agree") + " ***Thank you for applying. Our staff will take a look at your application and get back to you soon.***");
      var guild = channel.guild;
      console.log("");
      console.log("[Log] Form completed:");
      console.log("[Log] Form: modapp");
      console.log("[Log] Guild: " + guild.name);
      console.log("[Log] User: " + sender.tag);
      var applicationsChannel = guild.channels.find(chan => chan.name === "applications");
      if(!applicationsChannel) {
        console.log("[Error] " + guild.name + " does not have an applications channel.");
        return;
      }
      var embed = {
        "embed": {
          "title": ("Moderator Application From " + sender.tag),
          "description": "Time Completed: " + form.timestamp,
          "color": (14177048),
          "footer": {
            "text": "1-Bot | v" + (config.version || "0.1")
          },
          "thumbnail": {
            "url": ("https://i.imgur.com/QaqOKNh.png")
          },
          "fields": []
        }
      };
      for(var i in form.questions) {
        embed.embed.fields[i] = {
          "name": form.questions[i],
          "value": form.answers[i],
          "inline": true
        };
      }
      applicationsChannel.send(embed);
    });
  }
}