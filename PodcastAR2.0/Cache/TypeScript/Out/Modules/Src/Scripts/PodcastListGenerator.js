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
let user;
global.userContextSystem.requestUsername(function (username) {
    user = username;
});
//fetch podcast lists this would actually be a dictionary of name to id
const podcasts = [
    "Morning brew",
    "Acquire Hermes"
];
let GridContentCreator = class GridContentCreator extends BaseScriptComponent {
    onAwake() {
        const yStart = 0;
        const yOffset = -5.4;
        for (let i = 0; i < podcasts.length; i++) {
            const item = this.itemPrefab.instantiate(this.getSceneObject());
            let text = item.getChild(0).getComponent('Text');
            text.text = podcasts[i];
            let button = item.getChild(2).getComponent(PinchButton_1.PinchButton.getTypeName());
            button.onButtonPinched.add(() => this.onStateChangedCallback(podcasts[i]));
            const screenTransform = item.getComponent("Component.ScreenTransform");
            screenTransform.offsets.setCenter(new vec2(0, yStart + yOffset * i));
            item.enabled = true;
        }
    }
    __initialize() {
        super.__initialize();
        this.onStateChangedCallback = (podcast) => {
            //send trigger request here and set global variable for current podcast
            print(` podcast: ` + podcast + " user " + user);
            //call code to setup web socket and send connection message
        };
    }
};
exports.GridContentCreator = GridContentCreator;
exports.GridContentCreator = GridContentCreator = __decorate([
    component
], GridContentCreator);
//# sourceMappingURL=PodcastListGenerator.js.map