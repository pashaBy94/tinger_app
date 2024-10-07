const { HtmlTelegramBot, userInfoToString } = require("./bot");
const ChatGptService = require("./gpt");
const { theme } = require("./values");

class MyTelegramBot extends HtmlTelegramBot {
  constructor(token) {
    super(token);
    this.mode = null;
  }
  async hendler_commands(query) {
    console.log(query);
    switch (query.text) {
      case "/start":
        this.mode = 'main';
        const text = this.loadMessage("main");
        await this.sendImage("main");
        await this.sendText(text);
        break;
      case "/html": 
        const html =  this.loadHtml('main');
        await this.sendHTML(html, {theme: 'light'})
      break;
      case "/gpt":
        this.mode = 'gpt';
      break;
        default:
        break;
    }
  }
async gptDialog(){
  await this.sendText("<strong>I am gpt</strong>");

}

  async listener(msg) {
    switch (this.mode) {
      case 'main':
        await this.sendText("<strong>I am MAIN</strong>");
        break;
      case 'gpt':
        await this.gptDialog()
        break;
      default:
        break;
    }
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
const chatGpt = new ChatGptService("gpt:fXtFfefcMJW5gbKvJxHPJFkblB3TaymEaIPsJ1W67t7kdwMM");
console.log(2);
chatGpt.addMessage('Hello')

chatGpt.addMessage('Hello. Nice to meet you.')
const bot = new MyTelegramBot("8102407768:AAGMV8eLtDx47DclJ74KFBYdwOHnw8xPxiY");
bot.onTextMessage(bot.listener);
bot.onButtonCallback(/^.*/, bot.handler_themes_button);
bot.onCommand(/\/.*/, bot.hendler_commands);
