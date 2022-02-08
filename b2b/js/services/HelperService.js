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

myApp.factory('HelperService', function() {

    return {
        set: function(key, value) {
            return localStorage.setItem(key, value);
        },
        get: function(key) {
            return localStorage.getItem(key);
        },
        destroy: function(key) {
            return localStorage.removeItem(key);
        },
        isLogged: function(user) {
            if (this.get(user)) {
                return true;
            }
            return false;
        },
        getDeviceId: function() {
            if (localStorage.getItem("sadid")) {
                return localStorage.getItem("sadid");
            } else {
                var identifier = generateIdentifier();
                this.set("sadid", identifier);
            }
        },
        getToken: function() {
            this.get("sadtn");
        },
        setToken: function(value) {
            this.set("sadtn", value);
        },
        setNSNotification: function(value) {
            this.set("nsnoti", value);
        },
        getNSNotification: function() {
            return this.get("nsnoti");
        },
        setNENotification: function(value) {
            this.set("nenoti", value);
        },
        getNENotification: function() {
            return this.get("nenoti");
        }
    };
});