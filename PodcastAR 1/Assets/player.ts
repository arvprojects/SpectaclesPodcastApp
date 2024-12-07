import { ScreenImageCreator } from './ScreenImageCreator';
import { ImagesManager } from './ImagesManager';
const token = require('./spotifyAccessToken')
const authtoken = token.getToken()


@component
export class NewScript extends BaseScriptComponent {
  @input
  screenImageCreator:SceneObject;

  @input
  imagesManager: SceneObject;

  @input
  initialContainerFrame:SceneObject;

  @input
  remoteServiceModule: RemoteServiceModule;

  private remoteMediaModule: RemoteMediaModule = require('LensStudio:RemoteMediaModule');
    
 
   // Target timestamps in milliseconds
  private pollingInterval: number = 1; // Polling interval in seconds
  private tolerance: number = 500; // Tolerance in milliseconds (0.25 seconds)
  private targetMap: Map<string, { duration: number; imageLink: string; title: string }[]> = new Map();
  
    
  onAwake() {
    // Start polling playback state once map is loaded
    this.getMap().then((map) => {
      this.targetMap = map;
      this.pollPlaybackState();
    });
      print(this.initialContainerFrame.getChild(0).name)
    

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
        let matchingTimestamps: { duration: number; imageLink: string; title: string }[] = [];
                
        // Check if the current timestamp is within the tolerance range of any target timestamps
        Array.from(this.targetMap.keys()).forEach((key) => {
          const targetTimestamp = parseInt(key, 10);
          if (Math.abs(targetTimestamp - progressMs) <= this.tolerance) {
            const targets = this.targetMap.get(key);
            if (targets){
                matchingTimestamps.push(...targets);
            }
          }
        });
                
        if (matchingTimestamps.length > 0){
            print("found matches")
            this.onTimestampMatch(matchingTimestamps);                    
        }

      } else {
        print('Error fetching playback state:');
        print(response.statusCode);
      }
    });
  }
  
  // Function to handle when a timestamp match is found
  onTimestampMatch(matches: { duration: number; imageLink: string; title: string }[]) {
    if (matches.length > 0) {
        matches.forEach((match) => {
          print(`Timestamp matched! Title: ${match.title}, Fetching image from: ${match.imageLink}`);
          // let screenCreator = this.screenImageCreator.getComponent(ScreenImageCreator.getTypeName());       
          //  screenCreator.createScreenImage(match.imageLink, match.duration);

          let imgGenerator = this.imagesManager.getComponent(ImagesManager.getTypeName());
          imgGenerator.showScreenImage(match.imageLink, match.duration);

        });
      } else {
        print("No matching timestamps found.");
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
  getMap(): Promise<Map<string, { duration: number; imageLink: string; title: string }[]>> {
    return new Promise((resolve) => {
      let httpRequest = RemoteServiceHttpRequest.create();
      httpRequest.url = "https://podcastar-a2109-testdb.firebaseio.com/.json"; 
      httpRequest.method = RemoteServiceHttpRequest.HttpRequestMethod.Get;
      
      this.remoteServiceModule.performHttpRequest(httpRequest, (response) => {
          if (response.statusCode === 200) {
            const responseData = JSON.parse(response.body);
        
            Object.keys(responseData).forEach((key) => {
              const items = Object.values(responseData[key]); // Get the values of each key group
              const formattedItems = items.map((item: any) => ({
                  duration: item.duration,
                  imageLink: item.imageLink,
                  title: item.title,
                }));
              this.targetMap.set(key, formattedItems); // Set the key with formatted items
            });
        
            print(this.targetMap); // Verify the output
          }
          resolve(this.targetMap);
        });
    });
  }
}