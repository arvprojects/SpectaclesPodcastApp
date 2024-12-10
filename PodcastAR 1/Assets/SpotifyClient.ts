
const token = require('./spotifyAccessToken')
const authtoken = token.getToken()



@component
export class SpotifyService extends BaseScriptComponent {

    //set up remote service module
@input 
remoteServiceModule: RemoteServiceModule;
    

private remoteMediaModule: RemoteMediaModule = require('LensStudio:RemoteMediaModule');

    onAwake() {

    }

    async getPlayBackState(){
     
        print("in playback")
        
     let request = new Request('https://api.spotify.com/v1/me/player', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authtoken}`,
        'Content-Type': 'application/json',
        'Content-Length':'0'
      },
    });
     
        let response = await this.remoteServiceModule.fetch(request);
        

     if (response.status === 200) {
        const data = response.json()
        return data;

      } else {
        print("Error in getPlaybackState " + response.status)
        return null
      }
    }

    async pausePlayBackState(){
                print("in pause")

        
        
    let httpRequest = RemoteServiceHttpRequest.create();
    let request = new Request('https://api.spotify.com/v1/me/player/pause', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authtoken}`,
          'Content-Type': 'application/json',
          'Content-Length':'0'
        },
      });
       
    let response = await this.remoteServiceModule.fetch(request);
 

    return response.status
    }

    async startPlayBackState(){
                print("in start")

        const accessToken = authtoken
    let httpRequest = RemoteServiceHttpRequest.create();
    let request = new Request('https://api.spotify.com/v1/me/player/play', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Content-Length':'0'
        },
      });
       
    let response = await this.remoteServiceModule.fetch(request);
    return response.status
    }

    async skip(seconds){
                print("in skip")

        let body = await this.getPlayBackState();
        
        let current = body.progress_ms
        
     let NewPosition = current+(seconds *1000)
        
        
   let httpRequest = RemoteServiceHttpRequest.create();
    httpRequest.url = `https://api.spotify.com/v1/me/player/seek?position_ms=${NewPosition}`;
    httpRequest.method = RemoteServiceHttpRequest.HttpRequestMethod.Put;
    httpRequest.setHeader('Authorization', `Bearer ${authtoken}`);
    httpRequest.setHeader('Content-Type', 'application/json');
    httpRequest.setHeader('Content-Length','0');
    

    this.remoteServiceModule.performHttpRequest(httpRequest, (response) => {
      if (response.statusCode === 200) {
        print('Playback skipped successfully');
      } else {
        print('Error skipping playback:');
        print(response.statusCode);
      }
    });

    }

    async updateVolume(percent){
        print("in volume")
        let request = new Request(`https://api.spotify.com/v1/me/player/volume?volume_percent=${percent}`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${authtoken}`,
              'Content-Type': 'application/json',
                'Content-Length':'0'
            },
          });
           
           
              let response = await this.remoteServiceModule.fetch(request);
    print(response.status)
    }

   


}
