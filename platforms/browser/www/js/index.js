/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
function b64toBlobAlt(dataURI, contentType) {
    var ab, byteString, i, ia;
    byteString = atob(dataURI.split(',')[1]);
    ab = new ArrayBuffer(byteString.length);
    ia = new Uint8Array(ab);
    i = 0;
    while (i < byteString.length) {
        ia[i] = byteString.charCodeAt(i);
        i++;
    }
    return new Blob([ab], {
        type: contentType
    });
};

function blobToMp4(path){
  window.resolveLocalFileSystemURL(path, function(fileEntry) {
    return fileEntry.file(function(data) {
      var reader = new FileReader();
      reader.onloadend = function(e) {
        var blob = b64toBlobAlt(e.target.result, 'video/mp4');
        if (blob) {
           // do whatever you want with blob
        }
      };
      return reader.readAsDataURL(data);
    });
  });
}

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        document.getElementById('play').addEventListener('click', (function() {
            this.onPlay();
        }).bind(this), false);
        document.getElementById('flip').addEventListener('click', (function() {
            this.onFlip();
        }).bind(this), false);
        document.getElementById('stop').addEventListener('click', (function() {
            this.onStop();
        }).bind(this), false);
        document.getElementById('switch').addEventListener('click', (function() {
            this.onSwitch();
        }).bind(this), false);
        document.getElementById('torch').addEventListener('click', (function() {
            this.onTorch();
        }).bind(this), false);

        if (window.CanvasCamera) {
          window.CanvasCamera.initialize({
                fullsize: window.document.getElementById('fullsize')/*,
                thumbnail: window.document.getElementById('thumbnail')*/
          });
        }
    },
    onPlay: function() {
        console.log(window.CanvasCamera, '>>>>>>>>>window.CanvasCamera')
        if (window.CanvasCamera) {
            console.log('play start');
           var options = {
              canvas: {
                width: 320,
                height: 240
              },
              capture: {
                width: 320,
                height: 240
              },
              use: 'file',
              fps: 30,
              flashMode: this.flash,
              //hasThumbnail: true,
              //thumbnailRatio: 1/6,
              cameraFacing: this.position
          };
          window.CanvasCamera.start(options, function(error) {
            console.log('[CanvasCamera start]', 'error', error);
          }, function(data) {
            console.log('[CanvasCamera start]', 'data', data);
          });
        }
    },
    flip: {},
    onFlip: function() {
        console.log('flip');
        if (window.CanvasCamera) {
            var self = this;
            if (self.flip.flipped) {
                self.flip.scaleH = 1;
                self.flip.scaleV = 1;
                self.flip.flipped = false;
            } else {
                self.flip.scaleH = -1;
                self.flip.scaleV = -1;
                self.flip.flipped = true;
            }
            console.log(self.flip);
            if (!self.flip.listener) {
                self.flip.listener = true;
                window.CanvasCamera.beforeFrameRendering(function(event, frame){
                    this.context.save();
                    frame.dWidth   = frame.dWidth * self.flip.scaleH;
                    frame.dHeight  = frame.dHeight * self.flip.scaleV;
                    this.context.scale(self.flip.scaleH, self.flip.scaleV); 
                    console.log(self.flip.scaleH, self.flip.scaleV);
                });
                window.CanvasCamera.afterFrameRendering(function(event, frame){
                    this.context.restore();
                });
            }
        }
    },
    flash: false,
    onTorch: function() {
        console.log('torch');
        if (window.CanvasCamera) {
            this.flash = (this.flash) ? false : true;
            window.CanvasCamera.flashMode(this.flash, function(error) {
              console.log('[CanvasCamera flashMode]', 'error', error);
            }, function(data) {
              console.log('[CanvasCamera flashMode]', 'data', data);
            });
        }
    },
    position: 'back',
    onSwitch: function() {
        console.log('switch');
        if (window.CanvasCamera) {
            this.position = (this.position === 'front') ? 'back' : 'front';
            window.CanvasCamera.cameraPosition(this.position, function(error) {
                console.log('[CanvasCamera cameraPosition]', error);
            }, function(data) {
                console.log('[CanvasCamera cameraPosition]', 'data', data);
            });
        }
    },
    onStop: function() {
        console.log('stop');
        if (window.CanvasCamera) {
            window.CanvasCamera.stop(function(error) {
                console.log('[CanvasCamera stop]', 'error', error);
            }, function(data) {
                console.log('[CanvasCamera stop]', 'data', data);
            });
        }
    }
};

app.initialize();

