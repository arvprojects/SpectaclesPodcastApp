"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpectaclesBackendClient = void 0;
var __selfType = requireType("./SpectaclesBackendClient");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const WebSocketHelper_1 = require("Scripts/Helper/WebSocketHelper");
const ContainerFrame_1 = require("../SpectaclesInteractionKit/Components/UI/ContainerFrame/ContainerFrame");
// let remoteServiceModule = require("LensStudio:RemoteServiceModule")
//let remoteMediaModule = require("LensStudio:RemoteMediaModule")
let SpectaclesBackendClient = class SpectaclesBackendClient extends BaseScriptComponent {
    onAwake() {
    }
    initializeWebSocketConnection(username, podcastId) {
        this.username = username;
        this.currentPodcastId = podcastId;
        print(this.username + " " + this.currentPodcastId);
        this.websocket = new WebSocketHelper_1.WebSocketConnection();
        this.websocket.onMessage((event) => {
            this.receiveMessage(event);
        });
        this.websocket.onClose(() => {
            this.triggerListeningToPodcast(this.username, this.currentPodcastId, false);
        });
        const delayedEvent = this.createEvent("DelayedCallbackEvent");
        delayedEvent.bind(() => {
            this.sendInitialMessage(username);
        });
        delayedEvent.reset(5);
    }
    sendInitialMessage(username) {
        const data = JSON.stringify({ spectacles_device_id: username });
        this.websocket.send(data);
    }
    receiveMessage(event) {
        let str = event.data;
        let obj = JSON.parse(str);
        if (obj['data'] == 'Connected') {
            print('connected to the web socket!');
        }
        //if data.start is true then call the instantiate image function
        else if (obj['start'] == true) {
            this.instantiateImage(obj);
        }
        else {
            this.destroyImage(obj['id']);
        }
    }
    async triggerListeningToPodcast(username, podcastId, start) {
        print('triggering listening ' + start);
        const response = await this.remoteServiceModule.fetch("https://arvprojects.com/trigger", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "spectacles_device_id": username,
                "podcast_id": podcastId,
                "start": start
            }),
        });
        let re = await response.json();
        let re2 = JSON.stringify(re);
        print(re2);
        print('Success:');
    }
    async instantiateImage(data) {
        let newContainer = this.containerPrefab.instantiate(this.getSceneObject());
        let container = newContainer.getComponent(ContainerFrame_1.ContainerFrame.getTypeName());
        container.setUseFollow(true);
        container.setIsFollowing(true);
        let imageComponent = newContainer.getChild(0).getChild(0);
        let img = imageComponent.getComponent("Component.Image");
        img.mainMaterial = img.mainMaterial.clone();
        //request and set image
        let httpRequest = RemoteServiceHttpRequest.create();
        httpRequest.url = data['storage_url'];
        httpRequest.method = RemoteServiceHttpRequest.HttpRequestMethod.Get;
        this.remoteServiceModule.performHttpRequest(httpRequest, (response) => {
            if (response.statusCode === 200) {
                let textureResource = response.asResource();
                this.remoteMediaModule.loadResourceAsImageTexture(textureResource, (texture) => {
                    img.mainPass.baseTex = texture;
                }, (error) => {
                    print('Error loading image texture: ' + error);
                });
            }
        });
        this.containers.set(data['id'], newContainer);
    }
    destroyImage(mediaId) {
        print('destroying image');
        let container = this.containers.get(mediaId);
        container.destroy();
    }
    async pausePlayback() {
        const response = await this.remoteServiceModule.fetch("https://arvprojects.com/spotify/pause?spectacles_device_id=" + this.username, {
            method: "PUT",
        });
    }
    async playPlayback() {
        const response = await this.remoteServiceModule.fetch("https://arvprojects.com/spotify/play?spectacles_device_id=" + this.username, {
            method: "PUT",
        });
    }
    async seekForward() {
        const response = await this.remoteServiceModule.fetch("https://arvprojects.com/spotify/seek/forward?spectacles_device_id=" + this.username, {
            method: "PUT",
        });
    }
    async seekBackward() {
        const response = await this.remoteServiceModule.fetch("https://arvprojects.com/spotify/seek/backward?spectacles_device_id=" + this.username, {
            method: "PUT",
        });
    }
    __initialize() {
        super.__initialize();
        this.containers = new Map();
        this.username = "vern416";
        this.remoteMediaModule = require('LensStudio:RemoteMediaModule');
    }
};
exports.SpectaclesBackendClient = SpectaclesBackendClient;
exports.SpectaclesBackendClient = SpectaclesBackendClient = __decorate([
    component
], SpectaclesBackendClient);
//# sourceMappingURL=SpectaclesBackendClient.js.map