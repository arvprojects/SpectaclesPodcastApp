@component
export class GetCatFacts extends BaseScriptComponent {
  @input
  remoteServiceModule: RemoteServiceModule;

  // Method called when the script is awake
  onAwake() {
   
  }
    
    getPlaybackState(){
         // Create a new HTTP request
    let httpRequest = RemoteServiceHttpRequest.create();
    httpRequest.url = 'https://api.spotify.com/v1/me/player'; // Set the URL for the request
    httpRequest.method = RemoteServiceHttpRequest.HttpRequestMethod.Get; // Set the HTTP method to GET
    httpRequest.setHeader('Authorization',`Bearer ${accessToken}`)
    httpRequest.setHeader('Content-Type','application/json')

    // Perform the HTTP request
    this.remoteServiceModule.performHttpRequest(httpRequest, (response) => {
      if (response.statusCode === 200) {
        // Check if the response status is 200 (OK)
        response=response.json()
        console.log('Playback State:', data);
      }
    });
        
    }
}

