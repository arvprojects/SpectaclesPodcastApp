//@input Asset.VoiceMLModule vmlModule {"label": "Voice ML Module"}
var options = VoiceML.ListeningOptions.create();
options.speechRecognizer = VoiceMLModule.SpeechRecognizer.Default;
// Language Code: "en_US", "es_MX", "de_DE"
options.languageCode = 'en_US';
//General Option
options.shouldReturnAsrTranscription = true;
options.shouldReturnInterimAsrTranscription = false;
//Speech Context
var onListeningEnabledHandler = function () {
  script.vmlModule.startListening(options);
};
var onListeningDisabledHandler = function () {
  script.vmlModule.stopListening();
};
var getErrorMessage = function (response) {
  var errorMessage = '';
  switch (response) {
    case '#SNAP_ERROR_INDECISIVE':
      errorMessage = 'indecisive';
      break;
    case '#SNAP_ERROR_NONVERBAL':
      errorMessage = 'non verbal';
      break;
    case '#SNAP_ERROR_SILENCE':
      errorMessage = 'too long silence';
      break;
    default:
      if (response.includes('#SNAP_ERROR')) {
        errorMessage = 'general error';
      } else {
        errorMessage = 'unknown error';
      }
  }
  return errorMessage;
};

var onUpdateListeningEventHandler = function (eventArgs) {
  if (eventArgs.transcription.trim() == '') {
    return;
  }
  
    
    if(!eventArgs.isFinalTranscription){
        return;
    }
    const transcription = eventArgs.transcription;
//  print('Transcription: ' + transcription);
  script.transcription = transcription;
    };
var onListeningErrorHandler = function (eventErrorArgs) {
  print(
    'Error: ' + eventErrorArgs.error + ' desc: ' + eventErrorArgs.description
  );
};

//script.vmlModule.startListening(options);


//VoiceML Callbacks
script.vmlModule.onListeningUpdate.add(onUpdateListeningEventHandler);
script.vmlModule.onListeningError.add(onListeningErrorHandler);
script.vmlModule.onListeningEnabled.add(onListeningEnabledHandler);
script.vmlModule.onListeningDisabled.add(onListeningDisabledHandler);

