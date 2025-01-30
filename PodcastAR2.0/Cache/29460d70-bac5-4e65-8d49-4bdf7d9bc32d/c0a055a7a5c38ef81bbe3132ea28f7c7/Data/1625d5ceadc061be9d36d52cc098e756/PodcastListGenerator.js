"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridContentCreator = void 0;
var __selfType = requireType("./PodcastListGenerator");
function component(target) { target.getTypeName = function () { return __selfType; }; }
/**
 * This class is responsible for creating and positioning grid content items based on a specified prefab and item count. It instantiates the items and arranges them vertically with a specified offset.
 */
const PinchButton_1 = require("SpectaclesInteractionKit/Components/UI/PinchButton/PinchButton");
const SpectaclesBackendClient_1 = require("Scripts/SpectaclesBackendClient");
const ContainerFrame_1 = require("../SpectaclesInteractionKit/Components/UI/ContainerFrame/ContainerFrame");
let user;
global.userContextSystem.requestUsername(function (username) {
    user = username;
});
//fetch podcast lists this would actually be a dictionary of name to id
const podcasts = new Map([
    ["Morning Brew Daily Jan 7th", "45ed0d09-ab9f-471d-8772-cae422f9151c"],
]);
let GridContentCreator = class GridContentCreator extends BaseScriptComponent {
    onAwake() {
        //   this.spectaclesBackendClient = new SpectaclesBackendClient()
        this.specs = this.scr.getComponent(SpectaclesBackendClient_1.SpectaclesBackendClient.getTypeName());
        this.spotifyMenuContainer = this.spotifyMenu.sceneObject.getComponent(ContainerFrame_1.ContainerFrame.getTypeName());
        const yStart = 0;
        const yOffset = -5.4;
        print(podcasts.keys.length);
        let i = 0;
        for (const podcast of podcasts.keys()) {
            const item = this.itemPrefab.instantiate(this.getSceneObject());
            let text = item.getChild(0).getComponent('Text');
            print('here');
            print(podcast);
            text.text = podcast;
            let button = item.getChild(2).getComponent(PinchButton_1.PinchButton.getTypeName());
            button.onButtonPinched.add(() => this.onStateChangedCallback(podcast));
            const screenTransform = item.getComponent("Component.ScreenTransform");
            screenTransform.offsets.setCenter(new vec2(0, yStart + yOffset * i));
            item.enabled = true;
            i++;
        }
    }
    __initialize() {
        super.__initialize();
        this.onStateChangedCallback = (podcast) => {
            this.containerFrame.sceneObject.enabled = false;
            print('in button clicked');
            this.specs.initializeWebSocketConnection(user, podcasts.get(podcast));
            this.specs.triggerListeningToPodcast(true);
            this.spotifyMenuContainer.sceneObject.enabled = true;
        };
    }
};
exports.GridContentCreator = GridContentCreator;
exports.GridContentCreator = GridContentCreator = __decorate([
    component
], GridContentCreator);
//# sourceMappingURL=PodcastListGenerator.js.map