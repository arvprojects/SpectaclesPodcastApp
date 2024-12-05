


@component
export class chatWrapper extends BaseScriptComponent {
    @input('Component.ScriptComponent')
    refScript: any;
    @input('Component.ScriptComponent') 
    containerFrame: any;
    
    
    @input chatText:Text
    
    onAwake() {
        this.containerFrame.sceneObject.enabled=false;

    }
    callGPT() {
        print('call gpt');
        this.refScript.onMicPress();
        this.containerFrame.sceneObject.enabled=true;
        let delayedEvent = this.createEvent("DelayedCallbackEvent");
        delayedEvent.bind(() => this.delayGptWindowClose()); //using an arrow function preserves context (this)
        delayedEvent.reset(10.0);
        
    }
    
    delayGptWindowClose(){
        this.containerFrame.sceneObject.enabled=false
        this.chatText.text = "Loading..."
        
    }
    
    
}
