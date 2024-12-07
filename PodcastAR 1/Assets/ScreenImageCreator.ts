import { NewScript } from "playback";
import { createCallback } from "SpectaclesInteractionKit/Utils/InspectorCallbacks";
// import {FrameMaterial} from "SpectaclesInteractionKit/Components/UI/ContainerFrame/Materials/FrameMaterial";
//import {ContainerFrameUIC} from "SpectaclesInteractionKit/Components/UI/ContainerFrame/ContainerFrame";

@component
export class ScreenImageCreator extends BaseScriptComponent {

    @input
    remoteServiceModule: RemoteServiceModule;

    @input()
    imgCont:ObjectPrefab;

    private remoteMediaModule: RemoteMediaModule = require('LensStudio:RemoteMediaModule');

    
    onAwake(){

    }

    
    createScreenImage(reqLink: string, duration:number){
        let nextCont = this.imgCont.instantiate(this.getSceneObject());    
        
        
        if(nextCont){
            print("to putting image")
            let imageComponent =  nextCont.getChild(0).getChild(1);
            let img = imageComponent.getComponent("Component.Image")
            img.mainMaterial = img.mainMaterial.clone();
            print("image: " + img)
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
                    print(texture.uniqueIdentifier);
                  },
                  (error) => {
                    print('Error loading image texture: ' + error);
                  }
                );
              }
            });
        }
        print("screen image created ");
        
        //duration given in ms right now so delays deletiomn by given time in delayed callback
        const delayedEvent = this.createEvent("DelayedCallbackEvent");
        delayedEvent.reset((duration/1000));
        delayedEvent.bind(()=>this.deleteScreenImage(nextCont));
        
        return nextCont;
        
    }

    deleteScreenImage(screenImg:SceneObject){
        screenImg.destroy();
    }


 
    


}


//