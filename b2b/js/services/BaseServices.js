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

myApp.factory('RESTService', ['$http', '$rootScope', 'HelperService',
    function($http, $rootScope, HelperService) {
        return {
            get: function(url, headers, params, sucessCallBack, errorCallBack) {
                return $http({
                    method: 'GET',
                    url: url,
                    params: params,
                    headers: headers
                }).
                success(function(data, status, headers, config) {
                    sucessCallBack(data, status);
                }).
                error(function(data, status, headers, config) {
                    errorCallBack(data, status);
                });
            },
            post: function(url, body, headers, sucessCallBack, errorCallBack) {

                //var header = headers == null ? { 'Authorization': HelperService.getToken() }: null;
                return $http({
                    method: 'POST',
                    url: url,
                    data: body,
                    headers: headers
                }).
                success(function(data, status, headers, config) {
                    sucessCallBack(data, status);
                }).
                error(function(data, status, headers, config) {
                    errorCallBack(data, status);
                });
            },
            put: function(url, body, callback, headers) {

                return $http({
                    method: 'PUT',
                    url: url,
                    data: body,
                    headers: headers
                }).
                success(function(data, status, headers, config) {
                    callback(data, status);
                }).
                error(function(data, status, headers, config) {

                    $rootScope.isLoading = false;
                    $rootScope.gridLoaded = true;
                    if (status === 403) {
                        showSaveMessage('You do not have sufficient privilege to invoke the service', 'error');
                    } else if (status === 401) {
                        showSaveMessage('Session expired, please log in to SOA Proxy to re-activate session', 'error');
                    } else {
                        callback(data, status);
                    }
                });
            },
            delete: function(url, successCallBack, errorCallBack) {
                return $http({
                    method: 'DELETE',
                    url: url
                }).
                success(function(data, status, headers, config) {
                    successCallBack(data, status);
                }).
                error(function(data, status, headers, config) {
                    errorCallBack(data, status);
                });
            }

        };
    }]
);