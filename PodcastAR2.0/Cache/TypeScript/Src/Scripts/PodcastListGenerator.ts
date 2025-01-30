/**
 * This class is responsible for creating and positioning grid content items based on a specified prefab and item count. It instantiates the items and arranges them vertically with a specified offset.
 */
import { PinchButton } from 'SpectaclesInteractionKit/Components/UI/PinchButton/PinchButton';
import {PlatformBackendClient} from 'Scripts/PlatformBackendClient'
import {SpectaclesBackendClient} from 'Scripts/SpectaclesBackendClient'
import { ContainerFrame } from '../SpectaclesInteractionKit/Components/UI/ContainerFrame/ContainerFrame';

let user ;
global.userContextSystem.requestUsername(function(username){
  user=username
})


    declare global {
    var currentPodcastId: number;
    }



//fetch podcast lists this would actually be a dictionary of name to id

const podcasts = new Map<string, string>([
  ["Morning Brew Daily Jan 7th", "45ed0d09-ab9f-471d-8772-cae422f9151c"],
])


@component
export class GridContentCreator extends BaseScriptComponent {
  @input
  itemPrefab!: ObjectPrefab
  @input
  itemsCount: number = 10

  @input
  containerFrame:ScriptComponent;

  @input 
  spotifyMenu:ScriptComponent;
    
  @input 
   scr:SceneObject
   
    private platformBackendClient:PlatformBackendClient
    private spectaclesBackendClient: SpectaclesBackendClient
    private specs;
    private spotifyMenuContainer;

 
     onAwake(): void  {
     //   this.spectaclesBackendClient = new SpectaclesBackendClient()
        this.specs = this.scr.getComponent(
      SpectaclesBackendClient.getTypeName()
    );

    this.spotifyMenuContainer = this.spotifyMenu.sceneObject.getComponent(ContainerFrame.getTypeName());
        
      
    const yStart = 0
    const yOffset = -5.4
      print(podcasts.keys.length)
      let i =0;
    for (const podcast of podcasts.keys()) {
      const item = this.itemPrefab.instantiate(this.getSceneObject())
      let text=item.getChild(0).getComponent('Text')
      print('here')
      print(podcast)
      text.text=podcast

      let button = item.getChild(2).getComponent(PinchButton.getTypeName())
      
      button.onButtonPinched.add(() => this.onStateChangedCallback(podcast));


      const screenTransform = item.getComponent("Component.ScreenTransform")
      screenTransform.offsets.setCenter(new vec2(0, yStart + yOffset * i))
      item.enabled = true
      i++;
    }
  }
    
  

    onStateChangedCallback = (podcast) => {
      this.containerFrame.sceneObject.enabled=false;

        print('in button clicked') 
//   this.specs.initializeWebSocketConnection(user,podcasts.get(podcast));
//  this.specs.triggerListeningToPodcast(true);    

   this.spotifyMenuContainer.sceneObject.enabled = true;


  };
}
