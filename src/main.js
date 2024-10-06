const { HtmlTelegramBot, userInfoToString } = require("./bot");
const ChatGptService = require("./gpt");
const { theme } = require("./values");

class MyTelegramBot extends HtmlTelegramBot {
  constructor(token) {
    super(token);
  }
  async hendler_commands(query) {
    console.log(query);
    switch (query.text) {
      case "/start":
        const text = this.loadMessage("main");
        await this.sendImage("main");
        await this.sendText(text);
        break;
      default:
        break;
    }
  }
  async hello(msg) {
    await this.sendText(`Hello ${msg.from.first_name}`);
    await this.sendText("<strong>I am your helper</strong>");
    await this.sendImage("avatar_main");
    await this.sendTextButtons("What theme are you using now?", {
      [theme.theme_light]: "Lights theme",
      [theme.theme_dark]: "Darks theme",
    });
  }
  async handler_themes_button(query) {
    switch (query.data) {
      case theme.theme_light:
        await this.sendText(`You are using light theme.`);
        break;
      case theme.theme_dark:
        await this.sendText(`You are using dark theme.`);
        break;
      default:
        break;
    }
  }
}

const bot = new MyTelegramBot("8102407768:AAGMV8eLtDx47DclJ74KFBYdwOHnw8xPxiY");
bot.onTextMessage(bot.hello);
bot.onButtonCallback(/^.*/, bot.handler_themes_button);
bot.onCommand(/\/.*/, bot.hendler_commands);
