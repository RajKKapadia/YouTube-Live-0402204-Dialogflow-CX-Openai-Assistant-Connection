const { askTheAssistant } = require("./openaiApi");

const formatResponseForDialogflow = (message, sessionInfo='') => {
    let responseData = {
        fulfillmentResponse: {
            messages: [
                {
                    text: {
                        text: [message]
                    }
                }
            ]
        }
    }
    if (sessionInfo !== '') {
        responseData['sessionInfo'] = sessionInfo;
    }
    return responseData;
};

exports.webhook = async (req, res) => {
    console.log(req.body);
    console.log(JSON.stringify(req.headers));
    const query = req.body.text;
    let sessionInfo = req.body.sessionInfo;
    let threadId = '';
    if (sessionInfo.hasOwnProperty('parameters')) {
        if (sessionInfo.hasOwnProperty('threadId')) {
            threadId = sessionInfo.parameters.threadId;
        }
    }
    const askTheAssistantResponse = await askTheAssistant(query, threadId);
    sessionInfo['parameters'] = {
        threadId: askTheAssistantResponse.threadId
    };
    const responseData = formatResponseForDialogflow(askTheAssistantResponse.assistantReply, sessionInfo);
    res.send(responseData);
};
