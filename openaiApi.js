const { OpenAI } = require("openai");
require('dotenv').config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const ASSISTANT_ID = 'asst_oB1l8Yp34oMPP8NZOPDlmPOU';

const askTheAssistant = async (query, threadId) => {
    try {
        let thread = undefined;
        if (threadId === '') {
            thread = await openai.beta.threads.create();
        } else {
            thread = await openai.beta.threads.retrieve(threadId);
        }
        const message = await openai.beta.threads.messages.create(
            thread.id,
            {
                role: "user",
                content: query
            }
        );
        const run = await openai.beta.threads.runs.create(
            thread.id,
            {
                assistant_id: process.env.ASSISTANT_ID
            }
        );
        let flag = true;
        while (flag) {
            const retrieveRun = await openai.beta.threads.runs.retrieve(
                thread.id,
                run.id
            );
            if (retrieveRun.status === 'completed') {
                flag = false
            }
        }
        const messages = await openai.beta.threads.messages.list(
            thread.id
        );
        return {
            assistantReply: messages.data[0].content[0].text.value,
            threadId: thread.id
        };
    } catch (error) {
        console.log(`Error at askTheAssistant -> ${error}`);
        return {
            assistantReply: 'We are facing a technical issue at this time.',
            threadId: ''
        };
    }
};

module.exports = {
    askTheAssistant
};
