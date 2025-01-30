@component
export class NewScript extends BaseScriptComponent {
    //private remoteService: RemoteServiceModule = require("LensStudio:RemoteServiceModule");

    @input 
    remoteService: RemoteServiceModule;

    private url = "http://arvprojects.com"

    onAwake() {
      this.getSpotifyPlayback("aditya_505")
      print("hi")
    }
    

    //api calls for spectacles backend client
    
    //get spotify playback
    // getSpotifyPlaybackdemo(){
    //     let httpRequest = RemoteServiceHttpRequest.create();
    //     httpRequest.url =
    //     'https://developers.snap.com/img/spectacles/spectacles-2024-hero.png'; // Set the URL for the request
    //     httpRequest.method = RemoteServiceHttpRequest.HttpRequestMethod.Get; // Set the HTTP method to GET

    //         // Perform the HTTP request
    //     this.remoteService.performHttpRequest(httpRequest, (response) => {
    //         if (response.statusCode === 200) {
    //             // Check if the response status is 200 (OK)
    //         }
    //         });
    // }

    public getSpotifyPlayback(spectaclesDeviceId: string) {
        const spotifyPlaybackEndpoint = `/spotify/playback?spectacles_device_id=${spectaclesDeviceId}`;
        const fullUrl = `${this.url}${spotifyPlaybackEndpoint}`;
        const testurl = "http://arvprojects.com/spotify/playback?spectacles_device_id=aditya_505"

      //   this.remoteService
      //     .fetch(testurl, {
      //       method: "GET",
      //       headers: {
      //         "Content-Type": "application/json",
      //       },
      //     })
      //     .then((response) => response.json())
      //     .then((data) => {
      //       const is_playing = data.is_playing
      //       print('response data ' + is_playing)
      //     })
      //     .catch(failAsync);

      
      let httpRequest = RemoteServiceHttpRequest.create();
        httpRequest.url = testurl; // Set the URL for the request
        httpRequest.method = RemoteServiceHttpRequest.HttpRequestMethod.Get; // Set the HTTP method to GET

      this.remoteService.performHttpRequest(httpRequest, (response) => {
                if (response.statusCode === 200) {
                    const data = response.body;
                    print(data)

                }
                });
      }

      public pauseSpotify(spectaclesDeviceId: string) {
        const spotifyPauseEndpoint = `spotify/pause?spectacles_device_id=${spectaclesDeviceId}`;
        const fullUrl = `${this.url}/${spotifyPauseEndpoint}`;

        this.remoteService
          .fetch(fullUrl, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
          })
          .then((response) => {
            if (!response.ok) {
              // Handle HTTP errors
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
      
            // Check if there's a response body to parse
            if (response.status !== 204) {
              // Parse JSON response
              return response.json();
            }
      
            // For empty responses (e.g., 204 No Content), return null or an empty object
            return null;
          })
          .then((data) => {
            if (data) {
              print("Response Data:" + data);
              // Handle the parsed response data here
            } else {
              print("No content in response (204 No Content)");
            }
          })
          .catch(failAsync);
      }

      public playSpotify(spectaclesDeviceId: string) {
        const spotifyPlayEndpoint = `spotify/play?spectacles_device_id=${spectaclesDeviceId}`;
        const fullUrl = `${this.url}/${spotifyPlayEndpoint}`;

        this.remoteService
          .fetch(fullUrl, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
          })
          .then((response) => {
            if (!response.ok) {
              // Handle HTTP errors
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
      
            // Check if there's a response body to parse
            if (response.status !== 204) {
              // Parse JSON response
              return response.json();
            }
      
            // For empty responses (e.g., 204 No Content), return null or an empty object
            return null;
          })
          .then((data) => {
            if (data) {
              print("Response Data:" + data);
              // Handle the parsed response data here
            } else {
              print("No content in response (204 No Content)");
            }
          })
          .catch(failAsync);
      }

}
