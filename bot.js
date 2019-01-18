// Import Discord module
const discord = require("discord.js");
const config = require("config.json");

// Create client and login
var client = new discord.Client();
client.login(config.token);

// ####################
// Client Ready Event Handler
// ####################
client.on("ready", () => {
  console.log("Logged in as " + client.user.username + "#" + client.user.discriminator);
  const oneUp = client.guilds.find(guild => guild.name === "1-Up");
  if(!oneUp) {
    console.log("Could not find guild 1-Up");
    console.log("Logging out...");
    return;
  }
  console.log("Found guild 1-Up");
  const logs = oneUp.channels.find(chan => chan.name === "bot-logs");
  if(logs) {
    const curDate = new Date();
    var minutes = parseInt(curDate.getUTCMinutes());
    if(minutes < 10) {
      minutes = "0" + minutes;
    }
    var seconds = parseInt(curDate.getUTCSeconds());
    if(seconds < 10) {
      seconds = "0" + seconds;
    }
    logs.send(":white_check_mark: Bot Online **(" + (curDate.getUTCMonth() + 1) + "/" + curDate.getUTCDate() + "/" + curDate.getUTCFullYear() + " @ " + curDate.getUTCHours() + ":" + minutes + ":" + seconds + " UTC)**");
  }
});

// ####################
// Message Event Handler
// ####################
client.on("message", (msg) => {
  var sender = msg.author;
  var chan = msg.channel;
  if(sender.bot) {
    return;
  }
  if(msg.content.split("")[0] === "+") {
    var commandHandler;
    var command = msg.content.split(" ")[0].split("").splice(1).join("");
    var args = msg.content.split(" ").splice(1);
    try {
      commandHandler = require("./commands/" + command + ".js");
    } catch(error) {
      if(error.toString().toLowerCase().includes("cannot find module")) {
        return;
      }
      console.log("");
      console.error("[Error] Error handling command:");
      console.error("[Error] Command sent by " + msg.author.username + "#" + msg.author.discriminator);
      console.error("[Error] Command: " + command);
      return;
    }
    console.log("");
    console.log("[Log] Command sent by " + sender.username + "#" + sender.discriminator + ":");
    console.log("[Log] Command: " + command);
    var argsForLog = "[";
    for(var i in args) {
      if(i == args.length - 1) {
        argsForLog += args[i];
        break;
      }
      argsForLog += args[i] + ", ";
    }
    argsForLog += "]";
    console.log("[Log] Arguments: " + argsForLog);
    commandHandler.handle(msg, sender, chan, command, args);
    return;
  }
});

// ####################
// Guild Member Join Event Handler
// ####################
client.on("guildMemberAdd", (member) => {
  const guild = member.guild;
  const memberRole = guild.roles.find(role => role.name.toLowerCase() === "member");
  if(memberRole) {
    member.addRole(memberRole);
  }
  const welcomeChannel = guild.channels.find(chan => chan.name.toLowerCase() === "welcome");
  if(!welcomeChannel) {
    return;
  }
  const memberCount = guild.members.filter(memb => !memb.user.bot).array().length;
  welcomeChannel.send(":tada: Welcome, " + member.user.toString() + ", to " + guild.name + "! Enjoy your stay! Member Count: " + memberCount);
});

// ####################
// Guild Member Leave Event Handler
// ####################
client.on("guildMemberRemove", (member) => {
  const guild = member.guild;
  const leaveChannel = guild.channels.find(chan => chan.name === "leave");
  if(!leaveChannel) {
    return;
  }
  const memberCount = guild.members.filter(memb => !memb.user.bot).array().length;
  leaveChannel.send(guild.emojis.find(emoji => emoji.name === "disagree") + " **" + member.user.username + "#" + member.user.discriminator + "** has left " + guild.name + ". Member Count: " + memberCount);
});