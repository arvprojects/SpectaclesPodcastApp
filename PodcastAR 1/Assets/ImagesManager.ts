import { ContainerFrame } from "SpectaclesInteractionKit/Components/UI/ContainerFrame/ContainerFrame";


@component
export class ImagesManager extends BaseScriptComponent {
    @input
    containerFrame1:ScriptComponent;
    @input
    containerFrame2:ScriptComponent;
    @input
    containerFrame3:ScriptComponent;
    @input
    containerFrame4:ScriptComponent;
    @input
    containerFrame5:ScriptComponent;
    
    @input
    remoteServiceModule: RemoteServiceModule;
    private remoteMediaModule: RemoteMediaModule = require('LensStudio:RemoteMediaModule');
    
    private imagesMap:Map<number,{ isPresent: boolean; container: ScriptComponent} > = new Map();
    

    onAwake() {
//        this.containerFrame1.sceneObject.enabled=false;
//        this.containerFrame2.sceneObject.enabled=false;
//        this.containerFrame3.sceneObject.enabled=false;
//        this.containerFrame4.sceneObject.enabled=false;
//        this.containerFrame5.sceneObject.enabled=false;
//
        this.imagesMap.set(1, {isPresent:false, container:this.containerFrame1})
        this.imagesMap.set(2, {isPresent:false, container:this.containerFrame2})
        this.imagesMap.set(3, {isPresent:false, container:this.containerFrame3})
        this.imagesMap.set(4, {isPresent:false, container:this.containerFrame4})
        this.imagesMap.set(5, {isPresent:false, container:this.containerFrame5})


        print("image manager running")

    }

    showScreenImage(reqLink: string, duration:number){
        //first find open slot
        let firstOpenKey = -1;
        for(let key = 1; key <= 5; key++){
            if (!this.imagesMap.get(key).isPresent){
                print("key " + key +" open");
                firstOpenKey = key;
                break;
            }
        }

        let openContainer = this.imagesMap.get(firstOpenKey).container;
        let originalPosition =  openContainer.getTransform().getLocalPosition();
        let originalRotation = openContainer.getTransform().getLocalRotation();
        let originalScale = openContainer.getTransform().getLocalScale();

        //set map to being used
        this.imagesMap.set(firstOpenKey, {isPresent:true, container:openContainer})

        //get container's image
        let containerImage = openContainer.sceneObject.getChild(0).getChild(1);
        let img = containerImage.getComponent("Component.Image")
        img.mainMaterial = img.mainMaterial.clone();

        //request and set image
        let httpRequest = RemoteServiceHttpRequest.create();
        httpRequest.url = reqLink;
        httpRequest.method = RemoteServiceHttpRequest.HttpRequestMethod.Get;
        this.remoteServiceModule.performHttpRequest(httpRequest, (response) => {
          if (response.statusCode === 200) {
            let textureResource = response.asResource();
            this.remoteMediaModule.loadResourceAsImageTexture(
              textureResource,
              (texture) => {
                img.mainPass.baseTex = texture;
              },
              (error) => {
                print('Error loading image texture: ' + error);
              }
            );
          }
        });

        //now visible
        openContainer.sceneObject.enabled=true;


        //set delayed descturcton/reset
        const delayedEvent = this.createEvent("DelayedCallbackEvent");
        delayedEvent.reset((duration/1000));
        delayedEvent.bind(()=>this.removeScreenImage(openContainer, firstOpenKey, 
            originalPosition, originalRotation, originalScale));
        

    }

    
    removeScreenImage(usedContainer: ScriptComponent, index:number, 
        originalPosition: vec3, originalRotation:quat, originalScale: vec3 ){
        //make invisible then slot in map now open
        usedContainer.sceneObject.enabled=false;
        this.imagesMap.set(index, {isPresent:false, container:usedContainer})

        //move it back

        usedContainer.getTransform().setLocalPosition(originalPosition);
        usedContainer.getTransform().setLocalRotation(originalRotation);
        usedContainer.getTransform().setLocalScale(originalScale);

    }
    
    
    
    
}
