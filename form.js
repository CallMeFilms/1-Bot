// Import discord module and config.json
const discord = require("discord.js");
const config = require("./config.json");

// #####################
// Module exports
// ####################
module.exports = {
  send: async function(user, questions, options, complete) {
    var embed = {
      "embed": {
        "title": (options.title || "Form"),
        "description": "Completion: 0% ▢▢▢▢▢▢▢▢▢▢",
        "color": (options.color || 14177048),
        "footer": {
          "text": "1-Bot | v" + (config.version || "0.1")
        },
        "thumbnail": {
          "url": (options.image || "https://i.imgur.com/QaqOKNh.png")
        },
        "fields": []
      }
    };
    for(var i in questions) {
      var question = questions[i];
      embed.embed.fields[i] = {
        "name": "**" + questions[i] + "**",
        "value": "TBD",
        "inline": true
      };
    }
    user.send(embed);
    var dmChan = await user.send(questions[0]).then(message =>  {
      return message.channel;
    });
    var counter = 0;
    var completionBar = "";
    var answers = [];
    var form;
    const collector = new discord.MessageCollector(dmChan, message => !message.author.bot, {maxMatches: 10000});
    collector.on("collect", (message) => {
      answers[counter] = message.content;
      var completed = Math.round(((counter + 1) / questions.length) * 100) / 100;
      completionBar = "";
      for(var i = 0; i < Math.round(completed * 10); i++) {
        completionBar += "▩";
      }
      for(var i = 0; i < 10 - Math.round(completed * 10); i++) {
        completionBar += "▢";
      }
      embed.embed.description = "Completion: " + Math.round(completed * 100) + "% " + completionBar;
      embed.embed.fields[counter].value = message.content;
      dmChan.send(embed);
      counter++;
      if(counter === questions.length) {
        collector.stop();
        const date = new Date(Date.now());
        var month = date.getUTCMonth() + 1;
        if(month < 10) {
          month = "0" + month;
        }
        var day = date.getUTCDate();
        if(day < 10) {
          day = "0" + day;
        }
        var minutes = date.getUTCMinutes();
        if(minutes < 10) {
          minutes = "0" + minutes;
        }
        var seconds = date.getUTCSeconds();
        if(seconds < 10) {
          seconds = "0" + seconds;
        }
        var timestamp = month + "/" + day + "/" + date.getUTCFullYear() + " @ " + date.getUTCHours() + ":" + minutes + ":" + seconds;
        const form = {
          "questions": questions,
          "answers": answers,
          "timestamp": timestamp
        };
        complete(form);
        return;
      }
      user.send(questions[counter]);
    });
  }
}


