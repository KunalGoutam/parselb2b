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

myApp.factory('ShipmentService', ['RESTService', '$rootScope', function(RESTService, $rootScope) {

    return {
        createDShipments: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/adm/createduniyashipments';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },

        deleteDShipment: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/adm/deleteshipment';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },

        retrieveDShipments: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/adm/retrieveshipments';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },

        getNearByDrivers: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/adm/retrieveallavailabledrivers';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },

        getLocation: function(input, successCallBack, errorCallBack) {
            var url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + input + ' &sensor=false';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },

        bookShipment: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/adm/createotshipments';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },

        bookb2bShipment: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/adm/createdoneshipments';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },

        createbcshipments: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/adm/createbcshipments';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },

        retrievecashipments: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/adm/retrievecashipments';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },

        retrieveNearByDrivers: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/adm/retrievenearbydrivers ';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },

        deleteShipment: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/adm/cancelshipment';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },

        deletemmShipment: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/adm/cancelmmshipment';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },

        retrieveShipments: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/sadm/getallshipments';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },
        getUnassignedJobs: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/drivr/unassignedjobs';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },
        assignShipments: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/sadm/assigndriver';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },
        reassignShipments: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/drivr/reassignshipment';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },
        validateShipmentAssign: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/adm/asauth';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },
        validateOpsAccess: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/adm/opsauth';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },
        unassignShipment: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/drivr/unassignedshipment';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },
        getSubHubs: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/adm/subcarriers';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },
        taToUa: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/adm/createuashipment';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },
        filterHubShipments: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/adm/filterhubshipment';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },
        mmassignments: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/adm/mmassignments';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },
        getLoads: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/drivr/getshipmentloads';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },
        getRoutes: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/adm/getuploadedroutes';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },
        getShipmentDetails: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/adm/orderstatus';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },
        collectJioShipment: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/jio/collectnow';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },
        validatePinCode: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/jio/validpincode';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },
        getSlotsByClient: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/adm/userslots';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },
        changeSlot: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/adm/changeslot';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },
        filterShipment: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/sadm/filtershipment';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },
        continueIR: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/sadm/continueir';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },
        undoCancelItem: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/sadm/uncancelitem';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },
        searchShipment: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/sadm/findshipments';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },
        searchLiveOpsShipment: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/drivr/driverssfilter';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },
        getColdStorage: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/adm/getcoldstorage';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },
        getColdStorageRecords: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/adm/getcsrecords';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },
        updateColdStorage: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/adm/updatecoldstorage';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },
        searchDriverAssignedShipment: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/drivr/driverfiltershipment';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },
        getSkuReport: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/adm/driverskucash';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },
        updateSKU: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/adm/updatedriversku';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },
        getClusterUnassignShipments: function(input, successCallBack, errorCallBack, pathparam) {
            var url = $rootScope.baseUrl + '/adm/getclusterunassign/' + pathparam;
            RESTService.get(url, null, null, successCallBack, errorCallBack);
        },
        assignClusterShipments: function(input, successCallBack, errorCallBack, pathparam) {
            var url = $rootScope.baseUrl + '/sadm/groupassigndriver';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },
        getRoutes: function(input, successCallBack, errorCallBack, pathparam) {
            var url = $rootScope.baseUrl + '/adm/tjukroutes';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        }
    };
}]);

myApp.factory('ReportService', ['RESTService', '$rootScope', function(RESTService, $rootScope) {

    return {
        retrieveShipments: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/sadm/shipmentsreport';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },
        getReportData: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/sadm/reportpagedetails';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },
        getReportCount: function(input, successCallBack, errorCallBack, queryparams) {
            var url = $rootScope.baseUrl + '/sadm/dlreportsize?cIds=' + queryparams;
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },
        getLiveOpsReport: function(input, successCallBack, errorCallBack, queryparams) {
            var url = $rootScope.baseUrl + '/drivr/driversscount';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },
        getAccessLogs: function(input, successCallBack, errorCallBack, queryparams) {
            var url = $rootScope.baseUrl + '/sadm/actionlist';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },
        getRunSheet: function(input, successCallBack, errorCallBack, queryparams) {
            var url = $rootScope.baseUrl + '/adm/runsheetlist';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },
        getRunSheetMapDetails: function(input, successCallBack, errorCallBack, queryparams) {
            var url = $rootScope.baseUrl + '/adm/runsheetmapdetails';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },
        getSKUReport: function(input, successCallBack, errorCallBack, queryparams) {
            var url = $rootScope.baseUrl + '/adm/infireports';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        }
    };
}]);

myApp.factory('DriversService', ['RESTService', '$rootScope', function(RESTService, $rootScope) {

    return {
        getDriverLocationDetails: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/drivr/driverdaylocationdetails';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },
        getDriverLocationLog: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/drivr/driverdaylocation';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },
        getDriverLocation: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/sadm/driverlocation';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },
        getAvailableDrivers: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/sadm/availabledrivers';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },
        getDrivers: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/sadm/getdriverdetails';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },
        getFDrivers: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/sadm/getalldrivers';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },
        getDriversByClient: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/sadm/getdriversondate';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },
        getAmtCollectedByDriver: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/sadm/getdrivercollectamount';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },
        saveActualAmount: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/sadm/saveamountondate';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },
        getDriverSpecificShipmentLog: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/sadm/getcompshipments';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },
        getCurrentShipments: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/sadm/getctshipments';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },
        filterDrivers: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/sadm/filterdrivers';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },
        getShipmentCount: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/drivr/getdsdateslot';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },
        getAllPVRDrivers: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/sadm/alldrivers';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },
        filterDriver: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/drivr/filterdriver';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },
        getDriversNotInJob: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/sadm/getnojobdrivers';
            RESTService.get(url, null, null, successCallBack, errorCallBack);
        },
        getShipmentDetails: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/drivr/driversummary';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },
        getReconcile: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/adm/infireconcile';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },
        reconcileDetails: function(input, successCallBack, errorCallBack, pathparam) {
            var url = $rootScope.baseUrl + '/adm/infireconciledetails';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },
        saveApprovedBy: function(input, successCallBack, errorCallBack, pathparam) {
            var url = $rootScope.baseUrl + '/adm/updateapproved';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },
        saveHandedAmount: function(input, successCallBack, errorCallBack, pathparam) {
            var url = $rootScope.baseUrl + '/adm/updatereconciledamt';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },
        getTJUKVehicle: function(input, successCallBack, errorCallBack, pathparam) {
            var url = $rootScope.baseUrl + '/adm/tjukvehicles';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },
        getDistanceTravelled: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/drivr/dtt';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },
        getArrivalDetails: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/adm/arrivedlist';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },
        getOldReturnDetails: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/drivr/oldreturnlist';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },
        getReturnInvoices: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/adm/getinvoices';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },
        getReturnedskus: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/adm/invoicereturnsku';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },
        getInvoiceBatches: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/adm/getbatches';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },
        saveCreditNote: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/adm/creditnote';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },
        sendtoSAP: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/adm/sendsap';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },
        getDC: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/drivr/getDCbyUserId?managerId='+input.managerId;
            RESTService.get(url, input, null, successCallBack, errorCallBack);
        },
        createRoute: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/drivr/createRoute';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },
        getListOfStores: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/drivr/getStoresByDc?dc='+input.dc;
            RESTService.get(url, input, null, successCallBack, errorCallBack);
        }
    };
}]);

myApp.factory('CarrierService', ['RESTService', '$rootScope', function(RESTService, $rootScope) {

    return {
        getWalletBalance: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/wallet/retrievewalletbalance';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        }
    };
}]);

myApp.factory('ManagersService', ['RESTService', '$rootScope', function(RESTService, $rootScope) {

    return {
        getAllManagers: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/sadm/allmanagers';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },
        addManager: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/sec/register1';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },
        getDriversForManager: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/sadm/getdriverdetails';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },
        allocateShift: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/drivr/allocateshift';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        }
    };
}]);

myApp.factory('CommonService', ['RESTService', '$rootScope', function(RESTService, $rootScope) {

    return {
        getUsers: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/sadm/listusers';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },
        getHubs: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/adm/fkhubs';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },
        getAdhocDriver: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/sadm/getActiveInactiveDrivers ';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },
        approveAdhocDriver: function(input, successCallBack, errorCallBack) {
            console.log(input);
            var url = $rootScope.baseUrl + '/sadm/updateDriverFlag?driverId='+input.driverId+'&flagType='+input.flagType ;
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        }
    };
}]);

myApp.factory('RegistrationService', ['RESTService', '$rootScope', function(RESTService, $rootScope) {

    return {
        register: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/sec/register';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },
        updateProfile: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/profile/edit';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },
        deleteAccount: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/profile/delete';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        }
    };
}]);

myApp.factory('FilterService', ['RESTService', '$rootScope', function(RESTService, $rootScope) {

    return {
        filterDrivers: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/sadm/filterdrivers';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },
        filterManagers: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/sadm/filtermanagers';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        },
        filterCarriers: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/sadm/filtercarriers';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        }
    };
}]);

myApp.factory('SecurityService', ['RESTService', '$rootScope', function(RESTService, $rootScope) {

    return {
        login: function(input, successCallBack, errorCallBack) {
            var url = $rootScope.baseUrl + '/sec/login';
            RESTService.post(url, input, null, successCallBack, errorCallBack);
        }
    };
}]);