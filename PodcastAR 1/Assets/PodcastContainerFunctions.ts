import {SpotifyService} from './SpotifyClient'
import {ApplicationRepository} from './ApplicationRepository'
import { ImagesManager } from './ImagesManager';
const token = require('./spotifyAccessToken')
const authtoken = token.getToken()


@component
export class NewScript extends BaseScriptComponent {
   @input
  Spotify: SpotifyService

  @input
  AppRepository: ApplicationRepository

  @input 
  remoteServiceModule: RemoteServiceModule

  @input
  screenImage: Image;
    
  @input
  imagesManager: SceneObject;


  private remoteMediaModule: RemoteMediaModule = require('LensStudio:RemoteMediaModule');

  private pollingInterval: number = 1; // Polling interval in seconds
  private tolerance: number = 500; // Tolerance in milliseconds (0.5 seconds)
  private targetMap: Map<string, { duration: number; imageLink: string; title: string }[]> = new Map();


   onAwake() {
    this.getMap().then((map) => {
        this.targetMap = map;
        this.pollPlaybackState();
      });
        
        
        
   }
   
     async checkTimeStampMatch() {
        print('in time stamp match')
    let responseData = await this.Spotify.getPlayBackState();
    const progressMs = responseData.progress_ms;
    const isPlaying = responseData.is_playing;
    print(`Current timestamp: ${progressMs}, Is playing: ${isPlaying}`);
    let matchingTimestamps: { duration: number; imageLink: string; title: string }[] = [];
        
    Array.from(this.targetMap.keys()).forEach((key) => {
          const targetTimestamp = parseInt(key, 10);
            
            print(key +"  "+progressMs)
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
        else{
            print('no match')
        }
    }

    
  

 pollPlaybackState() {
       
    this.checkTimeStampMatch(); // Fetch the playback state

    // Schedule the next poll using script's DelayedCallbackEvent
    const delayedEvent = this.createEvent("DelayedCallbackEvent");
    delayedEvent.bind(() => this.pollPlaybackState()); // Re-bind to call pollPlaybackState again
    delayedEvent.reset(this.pollingInterval); // Set delay in seconds
  }

    
  onTimestampMatch(matches: { duration: number; imageLink: string; title: string }[]) {
    if (matches.length > 0) {
        matches.forEach((match) => {
          print(`Timestamp matched! Title: ${match.title}, Fetching image from: ${match.imageLink}`);
       
          let imgGenerator = this.imagesManager.getComponent(ImagesManager.getTypeName());
          imgGenerator.showScreenImage(match.imageLink, match.duration);

        });
      } else {
        print("No matching timestamps found.");
    }

  }
    
//   async getMap(): Promise<Map<string, { duration: number; imageLink: string; title: string }[]>> {
//   
//    
//    let request = new Request('https://podcastar-a2109-testdb.firebaseio.com/.json', {
//      method: 'GET',
//      headers: {
//      },
//    });
//     
//        
//    let response = await this.remoteServiceModule.fetch(request);
//        
//    let responseData = response.json()
//        
//    
//        Object.keys(responseData).forEach((key) => {
//              const items = Object.values(responseData[key]); // Get the values of each key group
//              const formattedItems = items.map((item: any) => ({
//                  duration: item.duration,
//                  imageLink: item.imageLink,
//                  title: item.title,
//                }));
//              this.targetMap.set(key, formattedItems); // Set the key with formatted items
//            });
//        return this.targetMap
//  }
    
    
     getMap(): Promise<Map<string, { duration: number; imageLink: string; title: string }[]>> {
    return new Promise((resolve) => {
      let httpRequest = RemoteServiceHttpRequest.create();
      httpRequest.url = "https://podcastar-a2109-testdb.firebaseio.com/.json"; 
      httpRequest.method = RemoteServiceHttpRequest.HttpRequestMethod.Get;
      
      this.remoteServiceModule.performHttpRequest(httpRequest, (response) => {
          if (response.statusCode === 200) {
            const responseData = JSON.parse(response.body);
                   print(response.body)
        
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
       
}



