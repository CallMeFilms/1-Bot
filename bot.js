// Import Discord module
const discord = require("discord.js");
const config = require("./config.json");

// Create client and login
var client = new discord.Client();
client.login(config.token);

// ####################
// Client Ready Event Handler
// ####################
client.on("ready", () => {
  // Log when ready
  console.log("Logged in as " + client.user.username + "#" + client.user.discriminator);
  // Find 1-Up guild
  const oneUp = client.guilds.find(guild => guild.name === "1-Up");
  // If 1-Up could not be found, leave
  var guilds = client.guilds.array();
  // Loop through each guild
  for(var i in guilds) {
    console.log("Found guild " + guilds[i].name + "...");
    // If current guild has a bot logs channel, log when bot came online
    var logs = guilds[i].channels.find(chan => chan.name === "bot-logs");
    // console.log(logs);
    if(logs) {
      var curDate = new Date();
      var minutes = parseInt(curDate.getUTCMinutes());
      if(minutes < 10) {
        minutes = "0" + minutes;
      }
      var seconds = parseInt(curDate.getUTCSeconds());
      if(seconds < 10) {
        seconds = "0" + seconds;
      }
      logs.send((guilds[i].emojis.find(emoji => emoji.name === "agree") || ":white_check_mark:") + " Bot Online **(" + (curDate.getUTCMonth() + 1) + "/" + curDate.getUTCDate() + "/" + curDate.getUTCFullYear() + " @ " + curDate.getUTCHours() + ":" + minutes + ":" + seconds + " UTC)**");
    }
  }
});

// ####################
// Message Event Handler
// ####################
client.on("message", (msg) => {
  // Retrieve sender and channel
  var sender = msg.author;
  var chan = msg.channel;
  // If sender is bot, ignore event
  if(sender.bot) {
    return;
  }
  // If message starts with command prefix, handle command
  if(msg.content.split("")[0] === "+") {
    var commandHandler;
    // Retrieve command and arguments
    var command = msg.content.split(" ")[0].split("").splice(1).join("");
    var args = msg.content.split(" ").splice(1);
    // Try to import corresponding command module
    try {
      commandHandler = require("./commands/" + command + ".js");
    } catch(error) {
      // If module can't be found, leave handler
      if(error.toString().toLowerCase().includes("cannot find module")) {
        return;
      }
      // If module absence is not the error, log the error
      console.log("");
      console.error("[Error] Error handling command:");
      console.error("[Error] Command sent by " + msg.author.username + "#" + msg.author.discriminator);
      console.error("[Error] Command: " + command);
      console.error("[Error] " + error.message);
      return;
    }
    // Log command
    console.log("");
    console.log("[Log] Command sent by " + sender.username + "#" + sender.discriminator + ":");
    console.log("[Log] Command: " + command);
    // Add each argument to a stringified array
    var argsForLog = "[";
    for(var i in args) {
      if(i == args.length - 1) {
        argsForLog += args[i];
        break;
      }
      argsForLog += args[i] + ", ";
    }
    argsForLog += "]";
    // Log arguments array
    console.log("[Log] Arguments: " + argsForLog);
    // Send command to corresponding handler
    commandHandler.handle(msg, sender, chan, command, args);
    return;
  }
});

// ####################
// Guild Member Join Event Handler
// ####################
client.on("guildMemberAdd", (member) => {
  // Retrieve guild and corresponding member role
  const guild = member.guild;
  const memberRole = guild.roles.find(role => role.name.toLowerCase() === "member");
  // If member role exists, add role to member
  if(memberRole) {
    member.addRole(memberRole);
  }
  // Retrieve welcome channel
  const welcomeChannel = guild.channels.find(chan => chan.name.toLowerCase() === "welcome");
  // If welcome channel doesn't exist, leave handler
  if(!welcomeChannel) {
    return;
  }
  // Retrieve new guild member count and send welcome message with count
  const memberCount = guild.members.filter(memb => !memb.user.bot).array().length;
  welcomeChannel.send(":tada: Welcome, " + member.user.toString() + ", to " + guild.name + "! Enjoy your stay! Member Count: " + memberCount);
});

// ####################
// Guild Member Leave Event Handler
// ####################
client.on("guildMemberRemove", (member) => {
  // Retrieve guild and corresponding leave channel
  const guild = member.guild;
  const leaveChannel = guild.channels.find(chan => chan.name === "leave");
  // If leave channel does not exist, leave handler
  if(!leaveChannel) {
    return;
  }
  // Retrieve new guild member count and send welcome message with count
  const memberCount = guild.members.filter(memb => !memb.user.bot).array().length;
  leaveChannel.send(guild.emojis.find(emoji => emoji.name === "disagree") + " **" + member.user.username + "#" + member.user.discriminator + "** has left " + guild.name + ". Member Count: " + memberCount);
});