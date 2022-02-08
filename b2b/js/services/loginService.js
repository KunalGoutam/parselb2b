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

myApp.factory('loginService',['sessionService', function(sessionService) {

    return {
        isLogged: function(user) {
            if (sessionService.get(user)) {
                return true;
            }
            return false;
        }
    };
}]);