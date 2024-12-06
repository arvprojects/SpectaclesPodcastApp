//@input Asset.VoiceMLModule vmlModule {"label": "Voice ML Module"}

var options = VoiceML.ListeningOptions.create();
options.shouldReturnAsrTranscription = true;
options.languageCode = 'en_US';


var onListeningEnabledHandler = function () {
  script.vmlModule.startListening(options);
    print('hello')
};

var onUpdateListeningEventHandler= function(eventArgs){
    print('hello')
};


script.vmlModule.onListeningEnabled.add(onListeningEnabledHandler);

