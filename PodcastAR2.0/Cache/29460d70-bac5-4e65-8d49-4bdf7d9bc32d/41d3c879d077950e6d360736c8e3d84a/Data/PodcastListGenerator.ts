/**
 * This class is responsible for creating and positioning grid content items based on a specified prefab and item count. It instantiates the items and arranges them vertically with a specified offset.
 */
import { PinchButton } from 'SpectaclesInteractionKit/Components/UI/PinchButton/PinchButton';
const user= global.userContextSystem.requestUsername(function(username){
  return username;
})

//fetch podcast lists
const podcasts =[
  "Morning brew",
  "Acquire Hermes"
]
@component
export class GridContentCreator extends BaseScriptComponent {
  @input
  itemPrefab!: ObjectPrefab
  @input
  itemsCount: number = 10

 
  onAwake(): void {
    const yStart = 0
    const yOffset = -5.4

    for (let i = 0; i < podcasts.length; i++) {
      const item = this.itemPrefab.instantiate(this.getSceneObject())
      let text=item.getChild(0).getComponent('Text')
      text.text=podcasts[i]

      let button = item.getChild(2).getComponent(PinchButton.getTypeName())
      
      
  
      button.onButtonPinched.add(() => this.onStateChangedCallback(podcasts[i]));


      const screenTransform = item.getComponent("Component.ScreenTransform")
      screenTransform.offsets.setCenter(new vec2(0, yStart + yOffset * i))
      item.enabled = true
    }
  }

   onStateChangedCallback = (podcast) => {
    //send trigger request here and set global variable for current podcast
    print(` podcast: `+podcast+" user "+user);
  };
}
