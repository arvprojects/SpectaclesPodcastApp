import { SIK } from './SpectaclesInteractionKit/SIK';

@component
export class ExampleHandScript extends BaseScriptComponent {
  
  @input('Component.ScriptComponent') containerFrame: any;
  @input audio: AudioComponent

  private pinchCount: number = 0;
  private lastPinchTime: number = 0;
  private pinchTimeoutNanos: number = 1_000_000_000; // 1 second in nanoseconds

  onAwake() {
    this.createEvent('OnStartEvent').bind(() => {
      this.onStart();
    });
  }

  onStart() {
    // Retrieve HandInputData from SIK's definitions.
    let handInputData = SIK.HandInputData;

    // Fetch the TrackedHand for left and right hands.
    let leftHand = handInputData.getHand('left');
    let rightHand = handInputData.getHand('right');

    // Add print callbacks for whenever these hands pinch.
    leftHand.onPinchDown.add(() => this.handlePinch());
    rightHand.onPinchDown.add(() => this.handlePinch());
  }

  handlePinch() {
    const currentTimeNanos = getRealTimeNanos(); // Current time in nanoseconds
    if (currentTimeNanos - this.lastPinchTime <= this.pinchTimeoutNanos) {
      this.pinchCount++;
    } else {
      this.pinchCount = 1; // Reset if outside timeout window
    }

    this.lastPinchTime = currentTimeNanos;

    if (this.pinchCount === 2) {
      if(this.containerFrame.sceneObject.enabled==true){

      this.containerFrame.sceneObject.enabled=false
                this.audio.sceneObject.enabled=true;
                this.audio.play(1)
                
      }
            else{
                
      this.containerFrame.sceneObject.enabled=true;
                
                print('hello')
            }
      
      
      
      this.pinchCount = 0; // Reset counter after detection
    }
  }
}

