"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandFollower = void 0;
var __selfType = requireType("./HandFollower");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const VectorUtils_1 = require("./VectorUtils");
const HandInputData_1 = require("../SpectaclesInteractionKit/Providers/HandInputData/HandInputData");
const WorldCameraFinderProvider_1 = require("..//SpectaclesInteractionKit/Providers/CameraProvider/WorldCameraFinderProvider");
let HandFollower = class HandFollower extends BaseScriptComponent {
    onAwake() {
        this.createEvent("UpdateEvent").bind(() => {
            this.update();
        });
        this.handFollowObject.enabled = false;
    }
    update() {
        if (this.tryShowHandMenu(this.leftHand) ||
            this.tryShowHandMenu(this.rightHand)) {
            this.handFollowObject.enabled = true;
            this.noTrackCount = 0;
        }
        else {
            this.noTrackCount++;
            if (this.noTrackCount > 10) {
                this.handFollowObject.enabled = false;
            }
        }
    }
    tryShowHandMenu(hand) {
        if (!hand.isTracked()) {
            return false;
        }
        const currentPosition = hand.pinkyKnuckle.position;
        if (currentPosition != null) {
            const knuckleForward = hand.indexKnuckle.forward;
            const cameraForward = this.camera.getTransform().forward;
            const angle = Math.acos(knuckleForward.dot(cameraForward) /
                (knuckleForward.length * cameraForward.length)) * 180.0 / Math.PI;
            if (Math.abs(angle) > 20) {
                return false;
            }
            var directionNextToKnuckle = hand.handType == "left" ?
                hand.indexKnuckle.right :
                hand.indexKnuckle.right.mult(VectorUtils_1.VectorUtils.scalar3(-1));
            this.handFollowObject.getTransform().setWorldRotation(hand.indexKnuckle.rotation);
            this.handFollowObject.getTransform().setWorldPosition(currentPosition.add(directionNextToKnuckle.mult(VectorUtils_1.VectorUtils.scalar3(this.distanceToHand))));
            return true;
        }
        return false;
    }
    __initialize() {
        super.__initialize();
        this.handProvider = HandInputData_1.HandInputData.getInstance();
        this.leftHand = this.handProvider.getHand("left");
        this.rightHand = this.handProvider.getHand("right");
        this.camera = WorldCameraFinderProvider_1.default.getInstance();
        this.noTrackCount = 0;
    }
};
exports.HandFollower = HandFollower;
exports.HandFollower = HandFollower = __decorate([
    component
], HandFollower);
//# sourceMappingURL=HandFollower.js.map