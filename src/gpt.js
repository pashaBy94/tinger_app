const { OpenAI} = require('openai');
const {HttpsProxyAgent, HttpsProxyAgentOptions} = require('https-proxy-agent');

class ChatGptService {
    constructor(token) {
        if (token.startsWith('gpt:')) {
            token = 'sk-proj-' + token.slice(4).split('').reverse().join('');
        }
        this.openai = new OpenAI({
            apiKey: token, httpAgent: new HttpsProxyAgent("http://18.199.183.77:49232")
          });
        // const configuration = new Configuration({
        //     apiKey: token,
        //     baseOptions: {
        //         httpsAgent: new HttpsProxyAgent("http://18.199.183.77:49232")
        //     }
        // });
        // this.client = new OpenAIApi(configuration);
        this.messageList = [];
    }

    async sendMessageList() {
        console.log(this.messageList);
        
        console.log(this.openai.chat.completions);
        
        const completion = await this.openai.chat.completions.create({
            // model: 'gpt-3.5-turbo',  // gpt-4o, gpt-4-turbo, gpt-3.5-turbo
            model: "gpt-4o",
            messages: this.messageList,
            max_tokens: 3000,
            temperature: 0.9
        });
        console.log('completion',completion);

        const message = completion.choices[0].message;
        this.messageList.push(message);
        console.log(message);
        
        return message.content;
    }

    setPrompt(promptText) {
        this.messageList = [{role: 'system', content: promptText}];
    }

    async addMessage(messageText) {
        this.messageList.push({role: 'user', content: messageText});
        console.log(33);
        
        return await this.sendMessageList();
    }

    async sendQuestion(promptText, messageText) {
        this.messageList = [
            {role: 'system', content: promptText},
            {role: 'user', content: messageText}
        ];
        return await this.sendMessageList();
    }
}

module.exports = ChatGptService;