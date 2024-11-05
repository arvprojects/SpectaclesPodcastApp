//@input Asset.RemoteServiceModule remoteServiceModule
/** @type {RemoteServiceModule} */
var remoteServiceModule = script.remoteServiceModule;
//@input Component.Image screenImage
let remoteMediaModule = require('LensStudio:RemoteMediaModule');
function image(){
    

// Create a new HTTP request
let httpRequest = RemoteServiceHttpRequest.create();
httpRequest.url =
  'https://developers.snap.com/img/spectacles/spectacles-2024-hero.png'; // Set the URL for the request
httpRequest.method = RemoteServiceHttpRequest.HttpRequestMethod.Get; // Set the HTTP method to GET

// Perform the HTTP request
remoteServiceModule.performHttpRequest(httpRequest, (response) => {
  if (response.statusCode === 200) {
    // Check if the response status is 200 (OK)
    let textureResource = response.asResource(); // Convert the response to a resource
    remoteMediaModule.loadResourceAsImageTexture(
      textureResource,
      (texture) => {
        // Assign texture to a material mainPass baseTex
         script.screenImage.mainPass.baseTex = texture;
      },
      (error) => {
        print('Error loading image texture: ' + error); // Print an error message if loading fails
      }
    );
  }
});
}