"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatformBackendClient = void 0;
class PlatformBackendClient {
    constructor() {
        this.remoteServiceModule = require("LensStudio:RemoteServiceModule");
    }
    onAwake() {
    }
    async getPodcasts() {
        print('here');
        let request = new Request('https://52.14.101.11:5000/podcasts', {
            method: 'GET',
        });
        let response = await this.remoteServiceModule.fetch(request);
        print(response.status);
        if (response.status == 200) {
            let data = await response.json();
            return data;
            // Handle response
        }
    }
}
exports.PlatformBackendClient = PlatformBackendClient;
//# sourceMappingURL=PlatformBackendClient.js.map