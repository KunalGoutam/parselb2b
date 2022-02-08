/*******************************************************
 * Copyright (C) 2015-2018 {Dropbase Software Pvt. Ltd.} 
 * 
 * This file is part of PARSEL.
 * 
 * PARSEL cannot be copied and/or distributed without the express
 * permission of {Dropbase Software Pvt. Ltd}
 *
 * Proprietary and confidential

 *******************************************************/
 
'use strict';

myApp.factory('SocketService',['$websocket', '$rootScope', '$interval', 'HelperService', function($websocket, $rootScope, $interval, HelperService) {

    var socService = {};
    var ws = null;
    socService.previousDate = new Date();
    socService.pingInterval = 240000;
    socService.timer = null;
    socService.initializeConnection = function() {
            ws = $websocket.$new({
                url: $rootScope.wsUrl + $rootScope.userId,
                reconnect: true,
                reconnectInterval: 5000
            });
            if (ws.$open != 1) {
                ws.$open();
            };
            socService.registerListeners();
        },

        socService.registerListeners = function() {
            ws.$on('$open', socService.openConnListener);
            ws.$on('$close', socService.closeConnListener);
            ws.$on('$message', socService.msgListener);
        },

        socService.openConnListener = function() {
            console.log(ws.$status());
            if (ws.$status() == 1) {
                socService.timer = $interval(socService.pingMessage, socService.pingInterval);
            }
        },

        socService.closeConnListener = function() {
            ws.$close();
            console.log(ws.$status());
        },

        socService.sendMessage = function(data) {
            socService.previousDate = new Date();
            if (ws != null) {
                ws.$$send(data);
            }
        },

        socService.pingMessage = function() {
            if (new Date().getTime() - socService.previousDate.getTime() >= 240000) {
                var pingMsg = {"type": -1, "input": "Ping from :" + $rootScope.userId};
                socService.sendMessage(pingMsg);
            }
        },

        socService.msgListener = function(message) {
            if (message.responseCode == '1000') {
                if (message.type == 3) {
                    socService.generateSosAlert(message.sos);
                } else if (message.type == 16) {
                    if (angular.element('#mainHeader') != null) {
                        var count = message.jobs.notStarted.size() + message.jobs.notEnded.size();
                        angular.element('#mainHeader').scope().showNotificationCount(count);
                    }
                    HelperService.setNSNotification(angular.toJson(message.jobs.notStarted));
                    HelperService.setNENotification(angular.toJson(message.jobs.notEnded));
                } else {
                    if (angular.element('#qrPrintView') != null) {
                        angular.element('#qrPrintView').scope().setQRCode(message);
                    } else if (angular.element('#driversView') != null) {
                        angular.element('#driversView').scope().setDriverProfilePic(message);
                    }
                }
            } else {
                if (message.type == 16) {
                    if (angular.element('#mainHeader') != null) {
                        var count = message.jobs.notStarted.length + message.jobs.notEnded.length;
                        angular.element('#mainHeader').scope().showNotificationCount(count);
                    }
                    HelperService.setNSNotification(angular.toJson(message.jobs.notStarted));
                    HelperService.setNENotification(angular.toJson(message.jobs.notEnded));
                }
            } 
        },

        socService.generateMessage = function(content) {
            var title = 'Alert!! - Following shipments not started by driver';
            var footer = '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>';
            socService.setContent(title, content, footer);
        },

        socService.generateSosAlert = function(sos) {
            var name = sos.job.driver.firstName + " " + sos.job.driver.lastName;
            var driverPhone = sos.job.driver.phone;
            var vehicle = sos.job.driver.vehicle.vehicleClass;
            var title = 'Alert!! - Following driver has pressed SOS';
            var content = '<div class="col-md-12">' + 
                    '<div class="row">' +
                    '<div class="col-md-12">' +
                    '<label>Driver Name : </label> <span>' + name + '</span>' +
                    '</div>' +
                    '</div>' +
                    '<div class="row">' +
                    '<div class="col-md-12">' +
                    '<label>Driver Phone : </label> <span>' + driverPhone + '</span>' +
                    '</div>' +
                    '</div>' +
                    '<div class="row">' +
                    '<div class="col-md-12">' +
                    '<label>Vehicle Type: </label> <span>' + vehicle + '</span>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
            var html = $.parseHTML(content);
            var footer = '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>';
            socService.setContent(title, html, footer);
        },

        socService.setContent = function(title, content, footerContent) {

            var modalBody = $("#base-modal-body");
            modalBody.empty();
            modalBody.append(content);
            document.getElementById('base-modal-label').innerHTML = title;
            var footer = $("#base-modal-footer");
            footer.empty();
            footer.append(footerContent);
            $('#myModal').attr('class', 'modal fade');
            $('.modal-dialog').attr('class', 'modal-dialog');
            $('#myModal').modal('hide');
            $('#myModal').modal('show');
        }

        return socService;
}]);