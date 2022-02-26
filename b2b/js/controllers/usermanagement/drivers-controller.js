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
var driversController = myApp.controller('DriversController', ['$rootScope', '$scope', '$state', 'FilterService', 'CONSTANT', 'DriversService','CommonService', 'RegistrationService','CITIES', function($rootScope, $scope, $state, FilterService, CONSTANT, DriversService, CommonService, RegistrationService, CITIES) {

    $scope.selectedDriver = {
        "driver": {}
    };
    $scope.isDriverSelected = false;
    $scope.key = CryptoJS.enc.Base64.parse(CONSTANT.KEY);
    $scope.dateArr = [];
    $scope.onlineMinsArr = [];
    $scope.kmsArr = [];
    $scope.conveyanceArr = [];
    $scope.dataArr = [];
    $scope.hrsMinArr = [];
    $scope.attendanceStatus = 0;
    $scope.totalOnlineHours = 0;
    $scope.totalDistance = 0;
    $scope.totalConveyanceCharge = 0;
    $scope.isAttendanceViewSelected = false;
    $scope.vTypes = [{
            "name": "Bike",
            "id": 1,
            "class": "BIKE",
            "type": 1
        },
        {
            "name": "Mini",
            "id": 2,
            "class": "MINI",
            "type": 2
        },
        {
            "name": "Truck",
            "id": 3,
            "class": "TRUCK",
            "type": 3
        }
    ];

    $scope.vTypes2 = [{
        "name": "2T",
        "id": 1,
        "class": "BIKE",
        "type": 1
    },
    {
        "name": "4T",
        "id": 2,
        "class": "MINI",
        "type": 2
    },
    {
        "name": "6T",
        "id": 3,
        "class": "TRUCK",
        "type": 3
    }
];

$scope.vTypes3 = [{
    "name": "Refrigerated",
    "id": 1,
    "class": "BIKE",
    "type": 1
},
{
    "name": "Non-Refrigerated",
    "id": 2,
    "class": "MINI",
    "type": 2
}
];
    $scope.cities = CITIES.city_list;

    $scope.input = {
        "firstName": "",
        "lastName": "",
        "email": "",
        "phone": "",
        "password": "",
        "vehicle": $scope.vTypes2[0],
        "vNumber": "",
        "cNumber": "",
        "city": $scope.cities[0],
        "eRate": 0,
        "oRate": 0,
        "refigerated": $scope.vTypes3[0]

    };

    $scope.selectedManager = {
        "manager": {
            "userId": 0
        }
    };

    $scope.filterText = {
        "text": ""
    };
    $scope.getAllManagers = function() {
        var input = angular.toJson({"type": 2, "locality": CONSTANT.ALL});
        CommonService.getUsers(input, $scope.getAllManagersSC, $scope.getAllManagersEC);
    };

    $scope.getAllManagersSC = function(data) {
        if (data.responseCode === "1000") {
            $scope.managers = data.users;
        } 
    };

    $scope.getAllManagersEC = function() {
        
    };
    $scope.getAllManagers();
    $scope.getDriverDetails = function() {

        NProgress.start();
        var input = angular.toJson({
            "filterString": $scope.filterText.text
        });
        FilterService.filterDrivers(input, $scope.getDriverDetailsSC, $scope.getDriverDetailsEC);
    };

    $scope.getDriverDetailsSC = function(data) {
        $scope.drivers = [];
        NProgress.done();
        if (data.responseCode == "1000") {
            console.log(data);
            if (data.drivers.length > 0) {
                $scope.drivers = data.drivers;
                $scope.isDriverSelected = true;
                $scope.isAttendanceViewSelected = false;
                showAlert(CONSTANT.SUCCESS, "DE retrieved successfully");
                setContentHeight();
            } else {
                showAlert(CONSTANT.INFO, "No details found");
            }
        } else {
            $scope.isDriverSelected = false;
            showAlert(CONSTANT.ERROR, "Failed to retrieve DE");
        }
    };

    $scope.getDriverDetailsEC = function() {
        $scope.isDriverSelected = false;
        showAlert(CONSTANT.ERROR, "Internal error. Failed to retrieve DE");
    };

    $scope.viewAttendanceDetails = function(driver) {
        $scope.isAttendanceViewSelected = true;
        $('#reportrange span').html(moment().subtract(6, 'days').format('MMMM D, YYYY') + ' - ' + moment().format('MMMM D, YYYY'));
        $scope.selectedDriver.driver = driver;
        $scope.getAttendanceReport();
    };

    $scope.getAttendanceReport = function(fromDate, toDate) {
        NProgress.start();
        if (fromDate == null || fromDate == undefined) {
            fromDate = formatDate(moment().subtract(6, 'days'));
        }
        if (toDate == null || toDate == undefined) {
            toDate = formatDate(moment());
        }
        var input = angular.toJson({
            "date": "",
            "managerId": $scope.selectedDriver.driver.manager.userId,
            "startDateTime": fromDate,
            "endDateTime": toDate,
            "driverId": $scope.selectedDriver.driver.userId,
            "shiftType": ""
        });
        $scope.resetGraphDetails();
        DriversService.getAttendanceReport(input, $scope.getAttendanceReportSC, $scope.getAttendanceReportEC);
    };

    $scope.getAttendanceReportSC = function(data) {
        if (data.responseCode == "1000") {
            NProgress.done();
            if (data.drivers.length > 0) {
                $scope.attendanceStatus = data.drivers[0].driver.attendanceStaus;
                $scope.totalOnlineHours = data.drivers[0].driver.totalHoursAndMins;
                $scope.totalDistance = data.drivers[0].driver.totalDistanceTravelled;
                $scope.totalConveyanceCharge = data.drivers[0].driver.totalConveyance;
                for (var i = 0; i < data.drivers[0].driver.attendanceStaus.length; i++) {
                    $scope.dataArr = data.drivers[0].driver.attendanceStaus[i].split("_");
                    $scope.dateArr.push($scope.dataArr[0]);
                    $scope.hrsMinArr = $scope.dataArr[2].split(" ");
                    $scope.onlineMinsArr.push(Number($scope.hrsMinArr[0]) * 60 + Number($scope.hrsMinArr[2]));
                    $scope.kmsArr.push(Math.round(parseFloat($scope.dataArr[3].split(" ")[0]) * 100) / 100);
                    $scope.conveyanceArr.push(Math.round(parseFloat($scope.dataArr[4]) * 100) / 100 );
                }
                $scope.loadChart($scope.dateArr, $scope.onlineMinsArr, $scope.kmsArr, $scope.conveyanceArr);
                $("html, body").animate({
                    scrollTop: $("#attendanceChart").height()
                }, "slow");
                showAlert(CONSTANT.SUCCESS, "Attendance report generated successfully");
                setContentHeight();
            } else {
                showAlert(CONSTANT.INFO, "No details found");
            }
        } else {
            $scope.isDriverSelected = false;
            showAlert(CONSTANT.ERROR, "Failed to generate attendance report");
        }

    };

    $scope.getAttendanceReportEC = function() {
        $scope.isDriverSelected = false;
        showAlert(CONSTANT.ERROR, "Internal error. Failed to generate attendance report");
    };

    $scope.decryptPass = function(data) {
        if (data == undefined) return;
        var decryptedData = CryptoJS.AES.decrypt(data, $scope.key, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        var decryptedText = decryptedData.toString(CryptoJS.enc.Utf8);
        return decryptedText;
    };


    $scope.registerDriver = function() {
        
        NProgress.start();
        var input = {
            "firstName": $scope.input.firstName,
            "lastName": $scope.input.lastName,
            "userType": 3,
            "password": $scope.input.password,
            "email": $scope.input.email,
            "phone": $scope.input.phone,
            "vehicleName": "N/A",// Remove because we are using vehicleSize on this field.
            "vehicleType": $scope.input.vehicle.id,
            "vehicleNo": $scope.input.vNumber,
            "chassisNo": $scope.input.cNumber,
            "locality": $rootScope.locality,
            "managerId": $rootScope.userId,//$scope.selectedManager.manager.userId,
            "dr": {"ecom": $scope.input.eRate, "other": $scope.input.oRate},
            "vehicleSize": $scope.input.vehicle.name,
            "refigerated": $scope.input.refigerated.name,
            "userFlag":  $scope.input.adHocDriver == true ? 3:0
            
        };

        RegistrationService.register(input, $scope.regSC, $scope.regEC);
    };

    $scope.regSC = function(data) {
        NProgress.done();
        if (data.responseCode === "1000") {
            var userId = data.user.userId;
            showAlert(CONSTANT.SUCCESS, "Driver registered successfully");
            $("#driverModal").modal("hide");
            $scope.resetDriverDetails();
            $scope.getDriverDetails();
        } else {
            if (data.errors[0].code == 'TI.0.1.12' || data.errors[0].code == 'TI.0.1.13') {
                showAlert(CONSTANT.ERROR, "Driver registration failed. Email or phone already exists.");
            } else {
                showAlert(CONSTANT.ERROR, "Driver registration failed");
            }
        }
    };

    $scope.regEC = function() {
        NProgress.done();
        showAlert(CONSTANT.ERROR, "Internal error. Driver registration failed");
    };
    
    $scope.resetDriverDetails = function() {
        $scope.input = {
            "firstName" : "",
            "lastName": "",
            "email": "",
            "phone": "",
            "password": "",
            "vehicle": $scope.vTypes2[0],
            "vNumber": "",
            "cNumber": "",
            "city": $scope.cities[0],
            "eRate": 0,
            "oRate": 0,
            "refigerated": $scope.vTypes3[0]
        };
        $scope.RegistrationForm.$setPristine();
    };

    $scope.addNewDriver = function() {
        $scope.modalHeader = "Add New DE";
        $scope.footerText = "Register DE";
        $scope.isAdd = true;
        $scope.isEdit = false;
        $scope.resetDriverDetails();
        $("#driverModal").modal("show");
    };

    $scope.editDriverDetails = function(data) {
        $scope.resetDriverDetails();
        $scope.modalHeader = "Update Driver";
        $scope.footerText = "Update Driver";
        $scope.isAdd = false;
        $scope.isEdit = true;
        $scope.selVehicle = {};
        if (data.vehicle.vehicleType == 1) {
            $scope.selVehicle = $scope.vTypes[0];
        } else if (data.vehicle.vehicleType == 2) {
            $scope.selVehicle = $scope.vTypes[1];
        } else if (data.vehicle.vehicleType == 3) {
            $scope.selVehicle = $scope.vTypes[2];
        }
        $scope.selCity = {};
        for (var n = 0; n < $scope.cities.length; n++) {
            if ($scope.cities[n].name == data.locality) {
                $scope.selCity = $scope.cities[n];
            }
        }
        if (data.manager.userId == 0 || data.manager.userId == undefined) {
            $scope.selectedManager.manager = {};
            $scope.selectedManager.manager.userId = 0;
        } else {
            for (var m = 0; m < $scope.managers.length; m++) {
                if (data.manager.userId == $scope.managers[m].userId) {
                    $scope.selectedManager.manager = $scope.managers[m];
                }
            }
        }
        if (data.driverRate == null || data.driverRate == undefined) {
            data.driverRate = {
                "ecom": 0,
                "other": 0
            }
        }
        $scope.input = {
            "firstName" : data.firstName,
            "lastName": data.lastName,
            "email": data.email,
            "phone": Number(data.phone),
            "password": $scope.decryptPass(data.password),
            "vehicle": $scope.selVehicle,
            "vNumber": data.vehicle.vehicleNo,
            "cNumber": data.vehicle.chassisNo,
            "city": $scope.selCity,
            "eRate": data.driverRate.ecom,
            "oRate": data.driverRate.other
        };
        $scope.userId = data.userId;
        $scope.vehicleId = data.vehicle.vehicleId;
        $("#driverModal").modal("show");
    };

    $scope.deleteDriverDetails = function(data) {
        $scope.driverInfo = data.firstName + "  " + data.lastName;
        $scope.driverId = data.userId;
        $("#delDriverModal").modal("show");
    };

    $scope.deleteDriver = function() {
         NProgress.start();
        var delInput =  angular.toJson({
            "userId": $scope.driverId
        });
        RegistrationService.deleteAccount(delInput, $scope.deleteUserSC, $scope.deleteUserEC);
    };

    $scope.deleteUserSC = function(data) {
        NProgress.done();
        if (data.responseCode === "1000") {
            $("#delDriverModal").modal("hide");
            $scope.getDriverDetails();
            showAlert(CONSTANT.SUCCESS, "Driver deleted successfully.");
        } else if (data.responseCode === "1001") {
            if (data.errors[0].code == 'TI.0.11.47') {
                showAlert(CONSTANT.ERROR, "Failed to delete driver. Driver is in shipment");
            } else {
                showAlert(CONSTANT.ERROR, "Failed to delete driver.");
            }
        }
    };

    $scope.deleteUserEC = function() {
        NProgress.done();
        showAlert(CONSTANT.ERROR, "Internal Error. Failed to delete user.");
    };

    $scope.saveDriverDetails = function() {
        if ($scope.isAdd) {
            $scope.registerDriver();
        } else if ($scope.isEdit) {
            if ($scope.selectedManager.manager.userId == 0) {
                showAlert(CONSTANT.ERROR, "Please select manager");
                return;
            }
            $scope.updateDriver();
        }
    };

    $scope.updateDriver = function() {
         NProgress.start();
        var updatedInput = angular.toJson({
            "user": {
                "userId": $scope.userId,
                "firstName": $scope.input.firstName,
                "lastName": $scope.input.lastName,
                "userType": 3,
                "email": $scope.input.email,
                "phone": $scope.input.phone.toString(),
                "locality": $scope.input.city.name
            }, 
            "password": $scope.input.password,
            "vehicle": {
                "vehicleId":$scope.vehicleId,
                "vehicleName":$scope.input.vehicle.name,
                "vehicleClass":$scope.input.vehicle.class,
                "vehicleNo":$scope.input.vNumber,
                "vehicleType":$scope.input.vehicle.type,
                "chassisNo":$scope.input.cNumber,
            },
            "managerId": $scope.selectedManager.manager.userId,
            "dr": {"ecom": $scope.input.eRate, "other": $scope.input.oRate, "driverId": $scope.userId}
        });
        RegistrationService.updateProfile(updatedInput, $scope.updateDriverSC, $scope.updateDriverEC);
    };

    $scope.updateDriverSC = function(data) {
        NProgress.done();
        if (data.responseCode === "1000") {
            showAlert(CONSTANT.SUCCESS, "Driver profile updated successfully.");
            $("#driverModal").modal("hide");
            $scope.resetDriverDetails();
            $scope.getDriverDetails();
        } else if (data.responseCode === "1001") {
            if (data.errors[0].code == "TI.0.11.11" || data.errors[0].code == "TI.0.11.12") {
                showAlert(CONSTANT.ERROR, "Email or phone already exists");
            } else {
                showAlert(CONSTANT.ERROR, "Failed to update user.");
            }
        }
    };

    $scope.updateDriverEC = function() {
        NProgress.done();
        showAlert(CONSTANT.ERROR, "Internal error. Failed to update driver.");
    };

    $scope.loadChart = function(date, mins, kms, conveyance) {
        if ($('#attendanceChart').length) {

            var echartLine = echarts.init(document.getElementById('attendanceChart'), getTheme());

            echartLine.setOption({
                title: {
                    text: '',
                    subtext: ''
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    x: 220,
                    y: 40,
                    data: []
                },
                calculable: true,
                xAxis: [{
                    type: 'category',
                    boundaryGap: false,
                    data: date
                }],
                yAxis: [{
                    type: 'value'
                }],
                series: [{
                    name: 'Online Mins',
                    type: 'line',
                    smooth: true,
                    itemStyle: {
                        normal: {
                            areaStyle: {
                                type: 'default'
                            }
                        }
                    },
                    data: mins
                }, {
                    name: 'Kms',
                    type: 'line',
                    smooth: true,
                    itemStyle: {
                        normal: {
                            areaStyle: {
                                type: 'default'
                            }
                        }
                    },
                    data: kms
                }, {
                    name: 'Conveyance',
                    type: 'line',
                    smooth: true,
                    itemStyle: {
                        normal: {
                            areaStyle: {
                                type: 'default'
                            }
                        }
                    },
                    data: conveyance
                }]
            });

        }
    };

    $scope.get_DE = function(){
            console.log("Printing De");
            
            var input = angular.toJson({"date":"2022-01-31","toDate":null,
            "managerId":$rootScope.userId,"locality":$rootScope.locality,"index":-1,"count":-1,"type":1});
            CommonService.getAdhocDriver(input, $scope.getAdhocDriverSC, $scope.getAllManagersEC);
    }

    $scope.getAdhocDriverSC = function(data) {
        if (data.responseCode === "1000") {
            if(data.drivers.length == 0){
                $scope.dataNotAvail = "Data not available.";
            }else{
                $scope.dataNotAvail = " ";
            }
            $scope.adHocDriverData = data.drivers;
        } 
    };

    $scope.approveAdhoc= function(obj) {
        console.log(obj);
       var data = obj.adHocDriverdata;
       var input = {"driverId":data.userId,"flagType":1};
       CommonService.approveAdhocDriver(input, $scope.approveDriverSC, $scope.getAllManagersEC);
       
    }

    $scope.approveDriverSC = function(data) {
        if (data == true) {
            showAlert(CONSTANT.SUCCESS, "Driver approved");
            $scope.get_DE();
        } 
    };


    $scope.rejectAdhoc= function(obj) {
        showAlert(CONSTANT.SUCCESS, "Driver rejected");
        console.log(obj);
        var data = obj.adHocDriverdata;
        var input = {"driverId":data.userId,"flagType":4};
        CommonService.approveAdhocDriver(input, $scope.rejectDriverSC, $scope.getAllManagersEC);
    }

    
    $scope.rejectDriverSC = function(data) {
        if (data == true) {
            showAlert(CONSTANT.SUCCESS, "Driver Rejected");
            $scope.get_DE();
        } 
    };

  

    $scope.resetGraphDetails = function() {
        $scope.dateArr = [];
        $scope.onlineMinsArr = [];
        $scope.kmsArr = [];
        $scope.conveyanceArr = [];
        $scope.dataArr = [];
        $scope.hrsMinArr = [];
        $scope.attendanceStatus = 0;
        $scope.totalOnlineHours = 0;
        $scope.totalDistance = 0;
        $scope.totalConveyanceCharge = 0;
    };
    $scope.loadChart($scope.dateArr, $scope.onlineMinsArr, $scope.kmsArr, $scope.conveyanceArr);
    $(document).ready(function() {
        $('#reportrange').on('apply.daterangepicker', function(ev, picker) {
            NProgress.start();
            $scope.getAttendanceReport(picker.startDate.format('YYYY-MM-DD'), picker.endDate.format('YYYY-MM-DD'));
        });
    });
}]);