const token = require('./spotifyAccessToken')
const authtoken = token.getToken()

import { Slider } from 'SpectaclesInteractionKit/Components/UI/Slider/Slider';
import {SpotifyService} from './SpotifyService'


@component
export class NewScript extends BaseScriptComponent {
  @input
  remoteServiceModule: RemoteServiceModule;
  @input
  screenImage: Image;
  private remoteMediaModule: RemoteMediaModule = require('LensStudio:RemoteMediaModule');
    
  @input
  Volume: SceneObject;
  
  @input
  Spotify: SpotifyService
    


  
  
    
   // Target timestamps in milliseconds
  private pollingInterval: number = 10000.0; // Polling interval in seconds
  private tolerance: number = 1000; // Tolerance in milliseconds (0.5 seconds)
  private targetMap: Map<string, string> = new Map(); // Stores timestamps and image links
  isPause=false
  
//  
  onAwake() {
    // Start polling playback state once map is loaded
    this.getMap().then((map) => {
      this.targetMap = map;
      this.pollPlaybackState();
    });
            
       
 }
  
  // Function to get playback state
  async checkTimeStampMatch() {

      let response = await this.Spotify.getPlayBackState();
        
       if(response ==null){
     
            return;
        }
       
      

     if (response.status === 200) {
        const data = response.json()
     
        const progressMs = data.progress_ms;
        const isPlaying = data.is_playing;

//        print(`Current timestamp: ${progressMs}, Is playing: ${isPlaying}`);
//        
        // Check if the current timestamp is within the tolerance range of any target timestamps
        Array.from(this.targetMap.keys()).forEach((key) => {
          const targetTimestamp = parseInt(key, 10);
          if (Math.abs(targetTimestamp - progressMs) <= this.tolerance) {
            this.onTimestampMatch(this.targetMap.get(key));
          }
        });
            
        return data;

      } else {
        print('Error fetching playback state:');
        print(response.status);
      }
        
        
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
    this.checkTimeStampMatch(); // Fetch the playback state

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
    
  playPause(){
       
        if(this.isPause){
            this.startPlayback()
            this.isPause=false
        }else{
            this.pausePlayback()
            this.isPause=true
            
        }
    }
 // Function to start/resume playback
  startPlayback() {
    this.Spotify.startPlayBackState()
  }

  // Function to pause playback
  pausePlayback() {
    this.Spotify.pausePlayBackState()
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
    
  async skipAhead(){

        this.Spotify.skip(10)
  }
    async skipBack(){
      this.Spotify.skip(-10)
        
  }
    
    async updateVolume(){
        let accessToken=authtoken
       let slider = this.Volume.getComponent(Slider.getTypeName())
        let volumePercent = Math.floor(slider.currentValue*100) 
        this.Spotify.updateVolume(volumePercent)

    }
    
    async capture(){
        let body = await this.Spotify.getPlayBackState();
        let song = body.item.name
        let progress = body.progress_ms;
        print("song= "+song+" progress ="+progress)
        
    }
}
