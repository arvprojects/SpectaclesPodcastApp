const token = require('./spotifyAccessToken')
const authtoken = token.getToken()
@component
export class NewScript extends BaseScriptComponent {
  @input
  remoteServiceModule: RemoteServiceModule;
  @input
  screenImage: Image;
  private remoteMediaModule: RemoteMediaModule = require('LensStudio:RemoteMediaModule');

   // Target timestamps in milliseconds
  private pollingInterval: number = 1.0; // Polling interval in seconds
  private tolerance: number = 1000; // Tolerance in milliseconds (0.5 seconds)
  private targetMap: Map<string, string> = new Map(); // Stores timestamps and image links
  
  onAwake() {
    // Start polling playback state once map is loaded
    this.getMap().then((map) => {
      this.targetMap = map;
      this.pollPlaybackState();
    });
  }
  
  // Function to get playback state
  getPlaybackState() {
    const accessToken = authtoken
    let httpRequest = RemoteServiceHttpRequest.create();
    httpRequest.url = 'https://api.spotify.com/v1/me/player';
    httpRequest.method = RemoteServiceHttpRequest.HttpRequestMethod.Get;
    httpRequest.setHeader('Authorization', `Bearer ${accessToken}`);
    httpRequest.setHeader('Content-Type', 'application/json');

    this.remoteServiceModule.performHttpRequest(httpRequest, (response) => {
      if (response.statusCode === 200) {
        const data = JSON.parse(response.body);
        const progressMs = data.progress_ms;
        const isPlaying = data.is_playing;

        print(`Current timestamp: ${progressMs}, Is playing: ${isPlaying}`);
        
        // Check if the current timestamp is within the tolerance range of any target timestamps
        Array.from(this.targetMap.keys()).forEach((key) => {
          const targetTimestamp = parseInt(key, 10);
          if (Math.abs(targetTimestamp - progressMs) <= this.tolerance) {
            this.onTimestampMatch(this.targetMap.get(key));
          }
        });

      } else {
        print('Error fetching playback state:');
        print(response.statusCode);
      }
    });
  }
  
  // Function to handle when a timestamp match is found
  onTimestampMatch(imgLink: string | undefined) {
    if (imgLink) {
      print(`Timestamp matched! Fetching image from: ${imgLink}`);
      this.generateImage(imgLink);
    }
  }

  // Recursive function to poll playback state using DelayedCallbackEvent
  pollPlaybackState() {
    this.getPlaybackState(); // Fetch the playback state

    // Schedule the next poll using script's DelayedCallbackEvent
    const delayedEvent = this.createEvent("DelayedCallbackEvent");
    delayedEvent.bind(() => this.pollPlaybackState()); // Re-bind to call pollPlaybackState again
    delayedEvent.reset(this.pollingInterval); // Set delay in seconds
  }

  // Function to generate an image from a URL and set it as the screen image
  generateImage(reqLink: string) {
    let httpRequest = RemoteServiceHttpRequest.create();
    httpRequest.url = reqLink;
    httpRequest.method = RemoteServiceHttpRequest.HttpRequestMethod.Get;
    
    this.remoteServiceModule.performHttpRequest(httpRequest, (response) => {
      if (response.statusCode === 200) {
        let textureResource = response.asResource();
        this.remoteMediaModule.loadResourceAsImageTexture(
          textureResource,
          (texture) => {
            this.screenImage.mainPass.baseTex = texture;
          },
          (error) => {
            print('Error loading image texture: ' + error);
          }
        );
      }
    });
  }
 // Function to start/resume playback
  startPlayback() {
    const accessToken = authtoken
    let httpRequest = RemoteServiceHttpRequest.create();
    httpRequest.url = 'https://api.spotify.com/v1/me/player/play';
    httpRequest.method = RemoteServiceHttpRequest.HttpRequestMethod.Put;
    httpRequest.setHeader('Authorization', `Bearer ${accessToken}`);
    httpRequest.setHeader('Content-Type', 'application/json');
    httpRequest.setHeader('Content-Length','0')

    this.remoteServiceModule.performHttpRequest(httpRequest, (response) => {
      if (response.statusCode === 200) {
        print('Playback started successfully');
      } else {
        print('Error starting playback:');
        print(response.statusCode);
      }
    });
  }

  // Function to pause playback
  pausePlayback() {
    const accessToken = authtoken
    let httpRequest = RemoteServiceHttpRequest.create();
    httpRequest.url = 'https://api.spotify.com/v1/me/player/pause';
    httpRequest.method = RemoteServiceHttpRequest.HttpRequestMethod.Put;
    httpRequest.setHeader('Authorization', `Bearer ${accessToken}`);
    httpRequest.setHeader('Content-Type', 'application/json');
    httpRequest.setHeader('Content-Length','0')

    this.remoteServiceModule.performHttpRequest(httpRequest, (response) => {
      if (response.statusCode === 200) {
        print('Playback paused successfully');
      } else {
        print('Error pausing playback:');
        print(response.statusCode);
      }
    });
  }
  // Function to get map from Firebase
  getMap(): Promise<Map<string, string>> {
    return new Promise((resolve) => {
      let httpRequest = RemoteServiceHttpRequest.create();
      let itemMap = new Map<string, string>();
      httpRequest.url = "https://podcastar-a2109-default-rtdb.firebaseio.com/.json"; 
      httpRequest.method = RemoteServiceHttpRequest.HttpRequestMethod.Get;
      
      this.remoteServiceModule.performHttpRequest(httpRequest, (response) => {
        if (response.statusCode === 200) {
          const responseData = JSON.parse(response.body);
          responseData.forEach((dispObj) => {
            itemMap.set(dispObj.timestamp, dispObj.imgLink);
          });
        }
        resolve(itemMap);
      });
    });
  }
}
