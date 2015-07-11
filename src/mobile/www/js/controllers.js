/* global angular, document, window */
'use strict';

angular.module('mumu.controllers', [])

    .controller('LoginCtrl', function($scope, $timeout, $state) {
        $scope.user = {
            username: '',
            password: ''
        };

        $scope.login = function(){
            $state.go('home');
        };
    })

    .controller('HomeCtrl', function($scope, $stateParams, $timeout, $ionicScrollDelegate, ionicMaterialInk, ionicMaterialMotion, $socket, $cordovaGeolocation) {
        $scope.moment = moment;
        $scope.auth = {
            name: 'Nicky'
        };

        // CHAT
        $scope.chat = {
            list: [],
            message: ''
        };

        // listening chat from server
        $socket.on('chat', function (data) {
            $scope.chat.receive(data);
        });

        // sending chat to server
        $scope.chat.send = function(){
            // construct chat data
            var data = {
                name: $scope.auth.name,
                message: [$scope.chat.message],
                timestamp: +new Date()
            };

            // emit to server
            $socket.emit('chat', data);

            // reset text
            $scope.chat.message = '';

            // add to own chat list
            $scope.chat.receive(data);
        };

        // receive chat, from server or after send
        $scope.chat.receive = function(data){
            var prev = $scope.chat.list[$scope.chat.list.length-1] || {name: '', message: []};
            if(prev.name == data.name && moment(prev.timestamp, 'x').diff(moment(), 'minutes') <= 1){
                for(var i=0; i<data.message.length; i++){
                    prev.message.push(data.message[i]);
                }
                prev.timestamp = data.timestamp;
                $scope.chat.list[$scope.chat.list.length-1] = prev;
            }else{
                $scope.chat.list.push(data);
            }

            $timeout(function() {
                $ionicScrollDelegate.scrollBottom(true);
            }, 300);
        };

        var isIOS = ionic.Platform.isWebView() && ionic.Platform.isIOS();
        $scope.inputUp = function() {
            if (isIOS) $scope.data.keyboardHeight = 216;
            $timeout(function() {
                $ionicScrollDelegate.scrollBottom(true);
            }, 300);
        };

        $scope.inputDown = function() {
            if (isIOS) $scope.data.keyboardHeight = 0;
            $ionicScrollDelegate.resize();
        };

        $scope.closeKeyboard = function() {
            if(window.cordova && window.cordova.plugins.Keyboard) cordova.plugins.Keyboard.close();
        };

        // MAP
        $scope.map = {
            element: document.getElementById('map'),
            markers: [],
            options: {
                center: new window.google.maps.LatLng(-6.8543249, 107.588825),
                zoom: 13,
                mapTypeId: window.google.maps.MapTypeId.ROADMAP
            }
        };

        // load google maps
        $scope.map.object = new window.google.maps.Map($scope.map.element, $scope.map.options);

        // send map
        $scope.map.send = function(position){
            // construct data
            var data = {
                name: $scope.auth.name,
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                timestamp: +new Date()
            };

            // emit to server
            $socket.emit('map', data);

            // redraw
            $scope.map.redraw(data);
        };

        // get current location
        var location_options = {
            frequency : 10000,
            timeout : 10000,
            enableHighAccuracy: false
        };

        // watch location
        $scope.map.watch = $cordovaGeolocation.watchPosition(location_options);

        // on location change
        $scope.map.watch.then(
            null,
            function(err) {
                // error
            },
            function(position) {
                $scope.map.send(position);
            }
        );

        // listening on map from server
        $socket.on('map', function (data) {
            $scope.map.redraw(data);
        });

        // redraw marker
        $scope.map.redraw = function(data){
            if(typeof data !== 'undefined'){
                var deletes = [];
                for(var i=0; i<$scope.map.markers.length; i++){
                    if($scope.map.markers[i].name == data.name){
                        $scope.map.markers[i].setMap(null);
                        deletes.push(i);
                    }
                }

                for(var i=0; i<deletes.length; i++){
                    delete $scope.map.markers[deletes[i]];
                }

                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(data.latitude, data.longitude),
                    map: $scope.map.object,
                    icon: 'img/marker.png'
                });

                $scope.map.markers.push(marker);
            }

            $timeout(function(){
                google.maps.event.trigger($scope.map.object, 'resize');
            });
        };


        // TABS
        $scope.tabs = [{
            type: 'chat',
            label: 'Chat',
            icon: 'ion-android-chat'
        }, {
            type: 'map',
            label: 'Map',
            icon: 'ion-android-map'
        }, {
            type: 'app',
            label: 'Apps',
            icon: 'ion-aperture'
        }];
        $scope.showing = -1;
        $scope.show = function(num){
            $scope.showing = num;
            $scope.map.redraw();
        };
        $scope.show(0);
    })
;
