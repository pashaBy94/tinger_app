const { HtmlTelegramBot, userInfoToString } = require("./bot");
const ChatGptService = require("./gpt");
const { generateSequence } = require("./lib");
const { theme } = require("./values");

class MyTelegramBot extends HtmlTelegramBot {
  constructor(token) {
    super(token);
    this.mode = null;
    this.listMessages = [];
    this.generator = null;
    this.user = {};
    this.openerUser = {};
    this.questions = {
      name: "Как ваше имя?",
      sex: "Ваш пол?",
      age: "Ваш возвраст?",
      city: "В каком городе вы живете?",
      occupation: "Какая ваша профессия?",
      hobby: "Чем вы увлекаетесь?",
      goals: "Ваши цели знакомства?",
      wealth: "Какой ваш доход?",
      annoys: "Что вас раздражает в людях?",
    }
    this.questionsOpener = {
      sex: "Пол?",
      age: "Возвраст?",
      occupation: "Какая профессия?",
      hobby: "Чем увлекается?",
      goals: "Цели знакомства?",
      handsome: "Уровень привлекательности по десятибальной шкале.",
      annoys: "Что раздражает в людях?",
    }
  }
  async hendler_commands(query) {
    switch (query.text) {
      case "/start":
        this.mode = "main";
        const text = this.loadMessage("main");
        await this.sendImage("main");
        await this.sendText(text);
        await this.showMainMenu({
          start: "start",
          profile: "generate profile 😎",
          opener: "messages for dating 🥰",
          date: "communication with celebrities 🔥",
          message: "communication on my behalf 😈",
          html: "generate HTML",
          gpt: "ask GPT",
        });
        break;
      case "/html":
        const html = this.loadHtml("main");
        await this.sendHTML(html, { theme: "light" });
        break;
      case "/gpt":
        this.mode = "gpt";
        await this.gptInitial();
        break;
      case "/date":
        this.mode = "date";
        await this.dateInitial();
        break;
      case "/message":
        this.mode = "message";
        await this.messageInitial();
        break;
      case "/profile":
        await this.profileInitial();
        break;
      case "/opener":
        await this.openerInitial();
        break;
    }
  }
  async openerInitial(){
    const dateText = this.loadMessage("opener");
    await this.sendImage("opener");
    await this.sendTextButtons(dateText, {
      isOpener: "Да",
      isNotOpener: "Нет"
    });
  }
  async openerDialog(msg) {
    const text = msg.text;    
    if(this.generator.next(text).done){
      this.mode = this.generator = null;
      const promptProfile = this.loadPrompt('opener');
      const request = userInfoToString(this.user);      
      const result = await chatGpt.sendQuestion(promptProfile, request);
      await this.sendText(result + "🤖");
    }
  }
  async profileInitial(){
    const dateText = this.loadMessage("profile");
    await this.sendImage("profile");
    await this.sendTextButtons(dateText, {
      isProfile: "Да",
      isNotProfile: "Нет"
    });
  }
  async profileDialog(msg) {
    const text = msg.text;    
    if(this.generator.next(text).done){
      this.mode = this.generator = null;
      const promptProfile = this.loadPrompt('profile');
      const request = userInfoToString(this.user);      
      const result = await chatGpt.sendQuestion(promptProfile, request);
      await this.sendText(result + "🤖");
    }
  }
  async gptInitial() {
    const gptText = this.loadMessage("gpt");
    await this.sendImage("gpt");
    await this.sendText(gptText);
  }
  async gptDialog(msg) {
    const text = msg.text;
    const result = await chatGpt.sendQuestion("Ответь на вопрос", text);
    await this.sendText(result + "🤖");
  }
  async dateInitial() {
    const dateText = this.loadMessage("date");
    await this.sendImage("date");
    await this.sendTextButtons(dateText, {
      date_grande: "Ариана Гранде",
      date_robbie: "Марго Робби",
      date_zendaya: "Зендея",
      date_gosling: "Райан Гослинг",
      date_hardy: "Том Харди",
    });
  }
  async messageInitial() {
    this.listMessages.length = 0;
    const dateText = this.loadMessage("message");
    await this.sendImage("message");
    await this.sendTextButtons(dateText, {
      message_date: "Invite you on a date",
      message_next: "Generate a new message",
    });
  }
  async dateDialog(msg) {
    let loader = "...";
    const text = msg.text;
    // const self = this;
    const message = await this.sendText(loader);
    // const timer = setInterval(() => {
    //   if (message) self.editText(message, (loader += "."));
    // }, 1000);
    const answer = await chatGpt.addMessage(text);
    // clearInterval(timer);
    await this.editText(message, answer);
  }
  async messageDialog(msg) {
    this.listMessages.push(msg.text);
  }
  async listener(msg) {
    switch (this.mode) {
      case "main":
        break;
      case "gpt":
        await this.gptDialog(msg);
        break;
      case "date":
        await this.dateDialog(msg);
        break;
      case "message":
        await this.messageDialog(msg);
        break;
      case "profile":
        await this.profileDialog(msg);
        break;
      case "opener":
        await this.openerDialog(msg);
        break;
    }
  }
  async handler_themes_button(query) {
    const text = query.data;
    
    switch (true) {
      case theme.theme_light === text:
        await this.sendText(`You are using light theme.`);
        break;
      case theme.theme_dark === text:
        await this.sendText(`You are using dark theme.`);
        break;
      case text.startsWith("date_"):
        const promptDate = this.loadPrompt(text);
        chatGpt.setPrompt(promptDate);
        await this.sendImage(text);
        await this.sendText("<b>Meet me!</b>");
        break;
      case text.startsWith("message_"):
        const promptMessage = this.loadPrompt(text);
        const listMessages = this.listMessages.join("\n\n");
        const answer = await chatGpt.sendQuestion(promptMessage, listMessages);
        this.listMessages.push(answer);
        await this.sendText(answer);
        break;
      case text === 'isProfile':
        this.mode = "profile";
        this.generator = generateSequence(this.questions, 
          async (text)=>{ await this.sendText(text) }, 
          (user)=>{ this.user = user })
        this.generator.next()
        break
      case text === 'isNotProfile':
        this.sendText('OK')
        break
      case text === 'isOpener':
        this.mode = "opener";
        this.generator = generateSequence(this.questionsOpener, 
          async (text)=>{ await this.sendText(text) }, 
          (user)=>{ this.openerUser = user })
        this.generator.next()
        break
      case text === 'isNotOpener':
        this.sendText('OK')
        break
    }
  }
}
const chatGpt = new ChatGptService(
  "gpt:fXtFfefcMJW5gbKvJxHPJFkblB3TaymEaIPsJ1W67t7kdwMM"
);
const bot = new MyTelegramBot("8102407768:AAGMV8eLtDx47DclJ74KFBYdwOHnw8xPxiY");
bot.onTextMessage(bot.listener);
bot.onButtonCallback(/^.*/, bot.handler_themes_button);
bot.onCommand(/\/.*/, bot.hendler_commands);
