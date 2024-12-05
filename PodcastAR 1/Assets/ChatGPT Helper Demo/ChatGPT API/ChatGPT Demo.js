// @input Component.ScriptComponent refScript
// @input Component.Text outputDisplay

function onMicPress() {
    var delayedEvent = script.createEvent("DelayedCallbackEvent");
    delayedEvent.bind(requestGPT);
    delayedEvent.reset(5.0);
}

script.onMicPress = function () {
    onMicPress();
}

function requestGPT(){
    query = script.refScript.transcription;
    
    print(`Requesting answer for: ${query}`);
    const request = { 
    "temperature": 0,
    "messages": [
        {"role": "user", "content": query}
    ]
};
    global.chatGpt.completions(request, (errorStatus, response) => {
        if (!errorStatus && typeof response === 'object') {
            const mainAnswer = response.choices[0].message.content;
            print(mainAnswer);
            script.outputDisplay.text = mainAnswer;
        } else {
            print(JSON.stringify(response));
        }
    })
    
}
