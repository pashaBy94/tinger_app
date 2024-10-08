const { Configuration, OpenAIApi } = require("openai");
const {
  HttpsProxyAgent,
  HttpsProxyAgentOptions,
} = require("https-proxy-agent");

class ChatGptService {
  constructor(token) {
    if (token.startsWith("gpt:")) {
      token = "sk-proj-" + token.slice(4).split("").reverse().join("");
    }
    const configuration = new Configuration({
      apiKey: token,
      baseOptions: {
        httpsAgent: new HttpsProxyAgent("http://18.199.183.77:49232"),
      },
    });
    this.client = new OpenAIApi(configuration);
    this.messageList = [];
  }

  async sendMessageList() {
    // console.log(this.messageList);
    // const completion = await this.client.createChatCompletion({
    //   model: "gpt-3.5-turbo",
    //   messages: this.messageList,
    //   max_tokens: 3000,
    //   temperature: 0.9,
    // });

    // const completion = await this.client.createCompletion({
    //   model: "gpt-3.5-turbo",
    //   prompt: this.messageList.map((message) => message.content).join("\n"),
    //   max_tokens: 3000,
    //   temperature: 0.9,
    // });
    console.log(this.messageList);
    const completion = await this.client.createChatCompletion({
      model: "gpt-3.5-turbo", //gpt-3.5-turbo gpt-4o
      messages: this.messageList,
      max_tokens: 3000,
      temperature: 0.9,
    });
    const message = completion.data.choices[0].message;
    this.messageList.push(message);

    return message.content;
  }

  setPrompt(promptText) {
    this.messageList = [{ role: "system", content: promptText }];
  }

  async addMessage(messageText) {
    this.messageList.push({ role: "user", content: messageText });
    return await this.sendMessageList();
  }

  async sendQuestion(promptText, messageText) {
    this.messageList = [
      { role: "system", content: promptText },
      { role: "user", content: messageText },
    ];
    return await this.sendMessageList();
  }
}

module.exports = ChatGptService;
