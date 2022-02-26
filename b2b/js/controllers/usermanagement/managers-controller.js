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
var managersController = myApp.controller('ManagersController', ['$scope', 'CONSTANT', 'RegistrationService', 'ManagersService', 'FilterService','DriversService','ReportService', 'CITIES','MANAGER_TYPES',  function($scope, CONSTANT, RegistrationService, ManagersService, FilterService, DriversService, ReportService, CITIES,MANAGER_TYPES) {

    $scope.key = CryptoJS.enc.Base64.parse(CONSTANT.KEY);
    $scope.isManagerSelected = false;
    $scope.selectedManager = {manager : {}};
    $scope.cities = CITIES.city_list;
    $scope.manager = MANAGER_TYPES.manager_list;
    $scope.multicity = [];
    $scope.input = {
        "firstName" : "",
        "lastName": "",
        "email": "",
        "phone": "",
        "password": "",
        "city": $scope.cities[0],
        "manager": $scope.manager[0]
    };
    $scope.multicities = [
        {
        "label": "PALWAL",
        "id": "0"
        },
        {
        "label": "BALLABHGARH",
        "id": "1"
        },
        {
        "label": "SOHNA",
        "id": "2"
        },
        {
        "label": "MANESAR",
        "id": "3"
        }
    ]
    $scope.filterText = {"text": ""};
    $scope.isManagerSelected = false;
    $scope.isCompletedTripsSelected = false;

    $scope.decryptPass = function(data) {
        if (data == undefined) return;
        var decryptedData = CryptoJS.AES.decrypt(data, $scope.key, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        } );
        var decryptedText = decryptedData.toString( CryptoJS.enc.Utf8 );
        return decryptedText;
    };

    /*
    * This method registers a new manager to the system
    */
    $scope.registerManager = function() {
        
        NProgress.start();
        var input = {
            "firstName": $scope.input.firstName,
            "lastName": $scope.input.lastName,
            "userType": 5,
            "password": $scope.input.password,
            "email": $scope.input.email,
            "phone": $scope.input.phone,
            "locality": $scope.input.city.name,
            "locality1": $scope.select.cities.name.id
        };

        RegistrationService.register(input, $scope.regSC, $scope.regEC);
    };

    $scope.regSC = function(data) {
        NProgress.done();
        if (data.responseCode === "1000") {
            var userId = data.user.userId;
            showAlert("Manager registered successfully", "success");
            $("#managerModal").modal("hide");
            $scope.resetManagerDetails();
            $scope.applyFilter();
        } else {
            if (data.errors[0].code == 'TI.0.1.12' || data.errors[0].code == 'TI.0.1.13') {
                showAlert(CONSTANT.ERROR, "Manager registration failed. Email or phone already exists.");
            } else {
                showAlert(CONSTANT.ERROR, "Issue in registration.");
            }
        }
    };

    $scope.regEC = function() {
        NProgress.done();
        showAlert(CONSTANT.ERROR, "Internal error. Manager registration failed");
    };
    
    $scope.resetManagerDetails = function() {
        $scope.input = {
            "firstName" : "",
            "lastName": "",
            "email": "",
            "phone": "",
            "password": "",
            "city": $scope.cities[0],
            "manager": $scope.manager[0]
        };
        $scope.RegistrationForm.$setPristine();
    };

    
    
    $scope.manager_types = [
        { name: 'Ops Manager', value: 'Ops Manager' }, 
        { name: 'Dc Manager', value: 'Dc Manager' }, 
        { name: 'Dispatch Executive', value: 'Dispatch Executive' }
        ];


        $scope.name = 'World';

        $scope.example14model = [];
        $scope.setting1 = {
            scrollableHeight: '200px',
            scrollable: true,
            enableSearch: true
        };

        $scope.example14data = [{
            "label": "Alabama",
                "id": "AL"
        }, {
            "label": "Alaska",
                "id": "AK"
        }, {
            "label": "American Samoa",
                "id": "AS"
        }];

        // $scope.input = {manager : $scope.manager_types[0]};
        // console.log( $scope.input);
     
    $scope.addNewManager = function() {
        
   
        $scope.modalHeader = "Add New Manager";
        $scope.footerText = "Register Manager";
        $scope.isAdd = true;
        $scope.isEdit = false;
        $scope.resetManagerDetails();
        $("#managerModal").modal("show");
    };

    $scope.editManagerDetails = function(data) {
        $scope.resetManagerDetails();
        $scope.selCity = {};
        for (var n = 0; n < $scope.cities.length; n++) {
            if ($scope.cities[n].name == data.locality) {
                $scope.selCity = $scope.cities[n];
            }
        }
        $scope.modalHeader = "Update Manager";
        $scope.footerText = "Update Manager";
        $scope.isAdd = false;
        $scope.isEdit = true;
        $scope.input = {
            "firstName" : data.firstName,
            "lastName": data.lastName,
            "email": data.email,
            "phone": Number(data.phone),
            "password": $scope.decryptPass(data.password),
            "city": $scope.selCity
        };
        $scope.managerId = data.userId;
        $("#managerModal").modal("show");
    };

    /*
    * This method deletes the manager 
    */
    $scope.deleteManagerDetails = function(data) {
        $scope.managerInfo = data.firstName + "  " + data.lastName;
        $scope.managerId = data.userId;
        $("#delManagerModal").modal("show");
    };

    $scope.deleteManager = function() {
        NProgress.start();
        var delInput =  angular.toJson({
            "userId": $scope.managerId
        });
        RegistrationService.deleteAccount(delInput, $scope.deleteManagerSC, $scope.deleteManagerEC);
    };

    $scope.deleteManagerSC = function(data) {
        NProgress.done();
        if (data.responseCode === "1000") {
            $("#delManagerModal").modal("hide");
            $scope.getManagerDetails();
            showAlert(CONSTANT.SUCCESS, "Manager deleted successfully.");
        } else if (data.responseCode === "1001") {
            if (data.errors[0].code == 'TI.0.11.47') {
                showAlert(CONSTANT.ERROR, "Failed to delete manager. Manager has drivers assigned.");
            } else {
                showAlert(CONSTANT.ERROR, "Failed to delete manager.");
            }
        }
    };

    $scope.deleteManagerEC = function() {
        NProgress.done();
        showAlert(CONSTANT.ERROR, "Internal Error. Failed to delete manager.");
    };

    $scope.saveManagerDetails = function() {
        if ($scope.isAdd) {
            $scope.registerManager();
        } else if ($scope.isEdit) {
            $scope.updateManager();
        }
    };

    /*
    * This method updates the managers details
    */
    $scope.updateManager = function() {
        NProgress.start();
        var updatedInput = angular.toJson({
            "user": {
                "userId": $scope.managerId,
                "firstName": $scope.input.firstName,
                "lastName": $scope.input.lastName,
                "userType": 5,
                "email": $scope.input.email,
                "phone": $scope.input.phone.toString(),
                "locality": $scope.input.city.name
            }, 
            "password": $scope.input.password
        });
        RegistrationService.updateProfile(updatedInput, $scope.updateManagerSC, $scope.updateManagerEC);
    };

    $scope.updateManagerSC = function(data) {
        NProgress.done();
        if (data.responseCode === "1000") {
            showAlert(CONSTANT.SUCCESS, "Manager profile updated successfully.");
            $("#managerModal").modal("hide");
            $scope.resetManagerDetails();
            $scope.getManagerDetails();
        } else if (data.responseCode === "1001") {
            if (data.errors[0].code == "TI.0.11.11" || data.errors[0].code == "TI.0.11.12") {
                showAlert(CONSTANT.ERROR, "Email or phone already exists");
            } else {
                showAlert(CONSTANT.ERROR, "Failed to update manager.");
            }
        }
    };

    $scope.updateManagerEC = function() {
        NProgress.done();
        showAlert(CONSTANT.ERROR, "Internal error. Failed to update manager.");
    };
    
    $scope.getManagerDetails = function() {
        NProgress.start();
        var input = angular.toJson({"filterString": $scope.filterText.text});
        FilterService.filterManagers(input, $scope.getManagerDetailsSC, $scope.getManagerDetailsEC);
    };

    $scope.getManagerDetailsSC = function(data) {
        $scope.managers = [];
        NProgress.done();
        if (data.responseCode === "1000") {
            
            if (data.managers != null && data.managers.length > 0) {
                $scope.managers = data.managers;
                $scope.isManagerSelected = true;
                $scope.isCompletedTripsSelected = false;
                showAlert(CONSTANT.SUCCESS, "Manager details retrieved successfully");
            } else {
                showAlert(CONSTANT.INFO, "No managers found");
            }
        } else {
            $scope.isManagerSelected = false;
            showAlert(CONSTANT.ERROR, "Failed to retrieve manager details");
        }
    };

    $scope.getManagerDetailsEC = function() {
        $scope.isManagerSelected = false;
        NProgress.done();
        showAlert(CONSTANT.ERROR, "Internal error. Failed to get manager details");
    };

    $scope.viewCompletedTripsSummary = function(manager) {

    NProgress.start();
        var input = {"managerId":manager.userId,"index":0,"count":1000, "locality":manager.locality, "driverType":CONSTANT.INCLUDE_OP_DRIVERS};
        DriversService.getAllPVRDrivers(input, $scope.getAllPVRDriversSC, $scope.getAllPVRDriversEC);
    };

    $scope.getAllPVRDriversSC = function(data) {
        NProgress.done();
        if (data.responseCode === "1000") {
            $scope.drivers = data.drivers;
            var driversArr = [];
            for (var i = 0; i < $scope.drivers.length; i++) {
                driversArr.push($scope.drivers[i].userId);
            }
            $scope.getReports(driversArr);
            showAlert(CONSTANT.SUCCESS, "Drivers retrieved successfully");
        } else {
            showAlert(CONSTANT.ERROR, "Failed to get drivers");
        }
    };

    $scope.getAllPVRDriversEC = function() {
        NProgress.done();
        showAlert(CONSTANT.ERROR, "Internal Error. Failed to get drivers");
    };

    $scope.getReports = function(driverIds) {
            var prev = new Date();
            prev.setDate(prev.getDate() - 60);
            var input = {
                "fromDate": formatDate(prev),
                "toDate": formatDate(new Date()),
                "driverIds": driverIds
            };
            console.log(input);
            NProgress.start();
            ReportService.getQuantumReports(input, $scope.getReportsSC, $scope.getReportsEC);
        };

        $scope.getReportsSC = function(data) {
            NProgress.done();
            console.log(data);
            if (data.responseCode == "1000") {
                $scope.isCompletedTripsSelected = true;
                var chartArr = [];
                for (var i = 60; i >= 0; i--) {
                    var currentDate = new Date();
                    currentDate.setDate(currentDate.getDate() - i)
                    var filtered = data.qdrs.filter(function(el) {
                        return el.dt === formatDate(currentDate);
                    });
                    if (filtered != null && filtered.length > 0) {
                        $scope.completedCount = 0;
                        filtered.filter(function(el) {
                            $scope.completedCount = el.delivered + $scope.completedCount;
                        });
                        chartArr.push({"date":filtered[0].dt,"count":$scope.completedCount});
                    }
                }
                $scope.loadGraph(chartArr);
            } else {

            }
        }

        $scope.getReportsEC = function() {
            NProgress.done();
            showAlert(CONSTANT.ERROR, "Internal error. Failed to get reports");
        };

    $scope.loadGraph = function(graphData) {
        $("#tripSummary").empty();
        if ($('#tripSummary').length ){
            
                Morris.Bar({
                  element: 'tripSummary',
                  xkey: 'date',
                  ykeys: ['count'],
                  labels: ['count'],
                  hideHover: 'auto',
                  lineColors: ['#26B99A', '#34495E', '#ACADAC', '#3498DB'],
                  data: graphData,
                  resize: true,
                  barSizeRatio: 0.1
                });
                $(window).resize();
            
            }
    };

    $(document).ready(function() {
        $('#reportrange').on('apply.daterangepicker', function(ev, picker) {
            NProgress.start();
            $scope.getAttendanceReport(picker.startDate.format('YYYY-MM-DD'), picker.endDate.format('YYYY-MM-DD'));
        });
    });
}]);