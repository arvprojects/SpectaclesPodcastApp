@component
export class NewScript extends BaseScriptComponent {
  @input
  remoteServiceModule: RemoteServiceModule;

  // Method called when the script is awake
  onAwake() {
   
  }
    
    getPlaybackState(){
    const accessToken = 'BQAloMGDadkdhLtfj0S-l8zquuSNYLjCLGhv5kMFhPAoVM0TnzCbwZwIJqRnrs08HjxrZxhpAWPYTwe0doXdPxou85ijRngHKcMtFUpMc4uaypddZMITsWE7RmzCuy0IADt_3KnqISy1XRzSS7h2aHBsOrD7AMU7A37UA71tpPXTzcZcxHDNMFH_Xo8IPLLR1BOp-4rNFsnJJw'
    let httpRequest = RemoteServiceHttpRequest.create();
    httpRequest.url = 'https://api.spotify.com/v1/me/player'; // Set the URL for the request
    httpRequest.method = RemoteServiceHttpRequest.HttpRequestMethod.Get; // Set the HTTP method to GET
    httpRequest.setHeader('Authorization',`Bearer ${accessToken}`)
    httpRequest.setHeader('Content-Type','application/json')

    // Perform the HTTP request
    this.remoteServiceModule.performHttpRequest(httpRequest, (response) => {
      if (response.statusCode === 200) {
        const jsonObject = JSON.parse(response.body);
        print(jsonObject.is_playing)
        print(jsonObject.timestamp)
      }
    });
        
    }
}

