import { ContainerFrame } from "SpectaclesInteractionKit/Components/UI/ContainerFrame/ContainerFrame";

@component
export class NewScript extends BaseScriptComponent {
@input
containerFrame: ScriptComponent;

@input 
podcastContainer : ScriptComponent;

    onAwake() {

        let container = this.containerFrame.sceneObject.getComponent(ContainerFrame.getTypeName());
        container.closeButton.onTrigger.add(() => {
            container.sceneObject.enabled = false;
          });
            container.sceneObject.enabled=false

    }

    openSpotifyMenu(){
        let container = this.containerFrame.sceneObject.getComponent(ContainerFrame.getTypeName());
        container.sceneObject.enabled = true;
    }

    openPodcastMenu(){
        let container = this.podcastContainer.sceneObject.getComponent(ContainerFrame.getTypeName());
        container.sceneObject.enabled = true;
    }


    
}
