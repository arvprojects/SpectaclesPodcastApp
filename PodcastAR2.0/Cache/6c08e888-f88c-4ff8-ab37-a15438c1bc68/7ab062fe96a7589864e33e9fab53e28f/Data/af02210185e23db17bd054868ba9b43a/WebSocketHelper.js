"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketConnection = void 0;
const Event_1 = require("SpectaclesInteractionKit/Utils/Event");
const HOST = "wss://arvprojects.com/ws";
class WebSocketConnection {
    constructor() {
        this.remoteServiceModule = require("LensStudio:RemoteServiceModule");
        this.onMessageEvent = new Event_1.default();
        this.onMessage = this.onMessageEvent.publicApi();
        this.onErrorEvent = new Event_1.default();
        this.onError = this.onErrorEvent.publicApi();
        this.onOpenEvent = new Event_1.default();
        this.onOpen = this.onOpenEvent.publicApi();
        this.onCloseEvent = new Event_1.default();
        this.onClose = this.onCloseEvent.publicApi();
        this.connect();
    }
    connect() {
        this.webSocket = this.remoteServiceModule.createWebSocket(HOST);
        this.webSocket.addEventListener("error", this._onError.bind(this));
        this.webSocket.addEventListener("message", this._onMessage.bind(this));
        this.webSocket.addEventListener("open", this._onOpen.bind(this));
        this.webSocket.addEventListener("close", this._onClose.bind(this));
    }
    _onOpen(event) {
        print("WebSocket opened");
        this.onOpenEvent.invoke(event);
    }
    _onClose(event) {
        print("WebSocket closed");
        this.onCloseEvent.invoke(event);
    }
    _onError(event) {
        this.onErrorEvent.invoke(event);
    }
    async _onMessage(event) {
        print("Received Message");
        this.onMessageEvent.invoke(event);
    }
    send(data) {
        this.webSocket.send(data);
    }
    close() {
        this.webSocket.close();
    }
}
exports.WebSocketConnection = WebSocketConnection;
//# sourceMappingURL=WebSocketHelper.js.map