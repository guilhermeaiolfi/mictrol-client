var app = new Vue({
    el: '#app',
    data: {
        channels: [
            { state: false, left: 750, top: 250 },
            { state: false, left: 750, top: 150 },
            { state: false, left: 750, top: 50 },
            { state: false, left: 650, top: 250 },
            { state: false, left: 650, top: 150 },
            { state: false, left: 650, top: 50 },

            { state: false, left: 50, top: 250 },
            { state: false, left: 50, top: 150 },
            { state: false, left: 50, top: 50 },
            { state: false, left: 150, top: 250 },
            { state: false, left: 150, top: 150 },
            { state: false, left: 150, top: 50 },

            { state: false, left: 300, top: 350 },
            { state: false, left: 400, top: 350 },
            { state: false, left: 500, top: 350 },
            { state: false, left: 50, top: 350 }
        ],
        ws: null
    },
    methods: {
        onOpen: function () {
            console.log("Connected");
            const ws = this.ws;
            this.interval = setInterval(function () {
                ws.send("ping");
            }, 10000);
        },
        toggleChannel: function(channel) {
            this.channels[channel].state = !this.channels[channel].state;
            if (this.channels[channel].state) {
                this.ws.send("unmute:" + channel);
            } else {
                this.ws.send("mute:" + channel);
            }
        },
        mute: function(channel) {
            this.channels[channel].state = false;
        },
        unmute: function(channel) {
            this.channels[channel].state = true;
        },
        onError: function (evt) {
            console.log("error", evt);
        },
        onClose: function (evt) {
            console.log("close", evt);
        },
        onMessage: function (message) {
            var command = message.data;
            if (command.indexOf(":") != -1) {
                //console.log("Command: " + message.data);
                command = command.split(":");
                //console.log('.led-' + command[1]);
                if (command[0] == "unmuted") {
                    this.unmute(command[1]);
                } else if (command[0] == "muted") {
                    this.mute(command[1]);            
                } else if (command[0] == "state") {
                    var channels = command[1].split(",");
                    for (var i = 0; i < channels.length; i++) {
                        if (channels[i] == 1) {
                            this.unmute(i);
                        } else {
                            this.mute(i);
                        }
                    }
                }
            }
        }
    },
    beforeUnmount: function () {
        clearInterval(this.interval);
    },
    mounted: function () {
        var me = this;
        this.ws = new WebSocket("ws://10.3.142.64:3000/");
        this.ws.onopen = function (evt) {
            me.onOpen(evt); 
        }
        this.ws.onmessage = function (message) {
            me.onMessage(message);
        }
        this.ws.onclose = function (evt) {
            me.onClose(evt);
        }
        this.ws.onerror = function (evt) {
            me.onError(evt);
        }
    }
});
