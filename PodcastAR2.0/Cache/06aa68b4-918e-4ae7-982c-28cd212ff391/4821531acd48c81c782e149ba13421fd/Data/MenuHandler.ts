import { ContainerFrame } from "SpectaclesInteractionKit/Components/UI/ContainerFrame/ContainerFrame";

@component
export class NewScript extends BaseScriptComponent {
@input
containerFrame: ScriptComponent;



    onAwake() {

        let container = this.containerFrame.sceneObject.getComponent(ContainerFrame.getTypeName());
        container.closeButton.onTrigger.add(() => {
            container.sceneObject.enabled = false;
          });

    }

    openMenu(){
        let container = this.containerFrame.sceneObject.getComponent(ContainerFrame.getTypeName());
        container.sceneObject.enabled = true;
    }


    
}
