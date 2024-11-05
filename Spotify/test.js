@component
export class NewScript extends BaseScriptComponent {
  @input
  remoteServiceModule: RemoteServiceModule;

  private targetTimestamps: number[] = [1000, 2000, 5000];
  private pollingInterval: number = 1.0; // Polling interval in seconds
  private timeSinceLastPoll: number = 0; // Time elapsed since the last poll

  onAwake() {
    // Start polling using the update event
    this.getPlaybackState(); // Initial call
    this.startPolling();
  }

  // Function to get playback state
  getPlaybackState() {
    const accessToken = 'BQAloMGDadkdhLtfj0S-l8zquuSNYLjCLGhv5kMFhPAoVM0TnzCbwZwIJqRnrs08HjxrZxhpAWPYTwe0doXdPxou85ijRngHKcMtFUpMc4uaypddZMITsWE7RmzCuy0IADt_3KnqISy1XRzSS7h2aHBsOrD7AMU7A37UA71tpPXTzcZcxHDNMFH_Xo8IPLLR1BOp-4rNFsnJJw';

    let httpRequest = RemoteServiceHttpRequest.create();
    httpRequest.url = 'https://api.spotify.com/v1/me/player';
    httpRequest.method = RemoteServiceHttpRequest.HttpRequestMethod.Get;
    httpRequest.setHeader('Authorization', `Bearer ${accessToken}`);
    httpRequest.setHeader('Content-Type', 'application/json');

    this.remoteServiceModule.performHttpRequest(httpRequest, (response) => {
      if (response.statusCode === 200) {
        const data = JSON.parse(response.body);
        const progressMs = data.progress_ms;
        const isPlaying = data.is_playing;

        print(`Current timestamp: ${progressMs}, Is playing: ${isPlaying}`);
        
        // Check if the current timestamp matches any in the targetTimestamps array
        if (this.targetTimestamps.includes(progressMs)) {
          this.onTimestampMatch(progressMs);
        }

      } else {
        print('Error fetching playback state:');
        print(response.statusCode);
      }
    });
  }

  // Function to handle when a timestamp match is found
  onTimestampMatch(timestamp: number) {
    print(`Timestamp ${timestamp} matched! Calling designated function.`);
    this.targetFunction();
  }

  // Start polling playback state using updateEvent
  startPolling() {
    // Register the update event to run continuously
    script.createEvent("UpdateEvent").bind(() => this.updatePolling());
  }

  // Function to run each frame for custom polling
  updatePolling() {
    const deltaTime = getDeltaTime(); // Time since last frame in seconds
    this.timeSinceLastPoll += deltaTime;

    // Check if polling interval has been reached
    if (this.timeSinceLastPoll >= this.pollingInterval) {
      this.getPlaybackState(); // Fetch the playback state
      this.timeSinceLastPoll = 0; // Reset the timer
    }
  }

  // Placeholder for the target function to call on timestamp match
  targetFunction() {
    print("Target function triggered on timestamp match.");
    // Implement your specific logic here
  }
}
