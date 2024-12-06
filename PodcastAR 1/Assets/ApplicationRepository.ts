const token = require('./spotifyAccessToken')
const authtoken = token.getToken()

@component
export class ApplicationRepository extends BaseScriptComponent {
    @input remoteServiceModule :RemoteServiceModule
    
    onAwake() {

    }
    
    async getDB(){
        
        
      let request = new Request('https://podcastar-a2109-default-rtdb.firebaseio.com/.json', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authtoken}`,
        'Content-Type': 'application/json',
      },
    });
     
    let response = await this.remoteServiceModule.fetch(request);
       

     if (response.status === 200) {
        const data = response.json()
        return data;
    }
        
    }
}
