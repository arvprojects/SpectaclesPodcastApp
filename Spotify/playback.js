// Function to get playback state
async function getPlaybackState() {
  const accessToken = 'BQB5lKcvgzIXj8TomOMDAK24NYBU4OoBszSRmaXuIXhjVV8goXuqUAyEZRoIBTKkV-btMkgKCN9TNVgIEIWHbefwmMjo1DqVD8TU8GpJKJOQTmcoKWFvZr7tRamMoomupWPryg4ruvdt2BKYvk-LPY2FoCjhnX3RSz-Q72ne1hFAObQl4Mn8jsPN9xTpRtS_Sg'
  try {
    const response = await fetch('https://api.spotify.com/v1/me/player', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Playback State:', data);
      // Handle playback state data here
    } else {
      console.error(`Error fetching playback state: ${response.status} - ${response.statusText}`);
      const errorData = await response.json();
      console.error('Error details:', errorData);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Call the function
getPlaybackState();





