@component
export class GetHttpImage extends BaseScriptComponent {
  @input
  remoteServiceModule: RemoteServiceModule;
  @input  
  Image: Image;
  

  // Import the RemoteMediaModule
  private remoteMediaModule: RemoteMediaModule = require('LensStudio:RemoteMediaModule');

  // Method called when the script is awake
  onAwake() {
    }
    generateImage(){
    // Create a new HTTP request
    let httpRequest = RemoteServiceHttpRequest.create();
    httpRequest.url =
      'https://developers.snap.com/img/spectacles/spectacles-2024-hero.png'; // Set the URL for the request
    httpRequest.method = RemoteServiceHttpRequest.HttpRequestMethod.Get; // Set the HTTP method to GET

    // Perform the HTTP request
    this.remoteServiceModule.performHttpRequest(httpRequest, (response) => {
      if (response.statusCode === 200) {
        // Check if the response status is 200 (OK)
        let textureResource = response.asResource(); // Convert the response to a resource
        this.remoteMediaModule.loadResourceAsImageTexture(
          textureResource,
          (texture) => {
            // Assign texture to a material
            print(this.Image.mainPass.baseTex);
            this.Image.mainPass.baseTex = texture;
            print(texture);
          },
          (error) => {
            print('Error loading image texture: ' + error); // Print an error message if loading fails
          }
        );
      }
    });
  }

}