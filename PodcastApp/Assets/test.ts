@component
export class GetHttpImage extends BaseScriptComponent {
  @input
  remoteServiceModule: RemoteServiceModule;
  @input
  screenImage: Image

  // Import the RemoteMediaModule
  private remoteMediaModule: RemoteMediaModule = require('LensStudio:RemoteMediaModule');

  // Method called when the script is awake
  
    
   onAwake(){
        // Create a new HTTP request
    let httpRequest = RemoteServiceHttpRequest.create();
    httpRequest.url =
      "https://firebasestorage.googleapis.com/v0/b/podcastar-a2109.appspot.com/o/Elf.png?alt=media&token=f3a9ae7f-382c-4c23-9111-421af8cd0624"; // Set the URL for the request
    httpRequest.method = RemoteServiceHttpRequest.HttpRequestMethod.Get; // Set the HTTP method to GET
    
    // Perform the HTTP request
    this.remoteServiceModule.performHttpRequest(httpRequest, (response) => {
      if (response.statusCode === 200) {
        // Check if the response status is 200 (OK)     
                
//        print(response);
        let textureResource = response.asResource(); // Convert the response to a resource
        this.remoteMediaModule.loadResourceAsImageTexture(
          textureResource,
          (texture) => {
            // Assign texture to a material
            this.screenImage.mainPass.baseTex = texture;
          },
          (error) => {
            print('Error loading image texture: ' + error); // Print an error message if loading fails
          
                }
        );
      }
    });
        
    }
}

//    let httpRequest = RemoteServiceHttpRequest.create();
//    httpRequest.url = "https://podcastar-a2109.firebaseio.com/images/0/imgLink""
//      'https://developers.snap.com/img/spectacles/spectacles-2024-hero.png'; // Set the URL for the request
 //   httpRequest.method = RemoteServiceHttpRequest.HttpRequestMethod.Get; // Set the HTTP method to GET
        
//    https://firebasestorage.googleapis.com/v0/b/podcastar-a2109.appspot.com/o/images/0/imgLink"?alt=media&token=YOUR_STORAGE_TOKEN
//        https://podcastar-a2109.firebaseio.com/images/0/imgLink