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

var creditNoteController = myApp.controller('CreditNoteController', ['$scope', 'CONSTANT', 'DriversService', '$rootScope', '$state', function($scope, CONSTANT, DriversService, $rootScope, $state) {

    $scope.date = {
        "fromDate": new Date()
    };
    $scope.selectedDriver = { "driver": {} };

    $scope.amount = {
        "amtCollected": 0,
        "actualAmount": 0
    };

    $scope.app = {
        "cash": "",
        "data": "",
        "quantity": "",
    };
    $scope.selectedInvoice = {
        "invoice": ""
    };
    $scope.invoices = [];
    $scope.selectedSku = {
        "sku": {}
    };
    $scope.skus = [];
    $scope.batches = [];
    $scope.selectedBatch = {
        "batch": ""
    };

    $scope.formatAmount = function(amt) {
        return amt.toFixed(2);
    }

    $scope.saveCreditNote = function(data) {
        console.log(data);
        NProgress.start();
        var input = { "ccns": [{ sku: $scope.selectedSku.sku.prodName, quantity: $scope.app.quantity, batchNo: $scope.selectedBatch.batch }], "invoiceNo": $scope.selectedInvoice.invoice };
        console.log(input);
        DriversService.saveCreditNote(input, $scope.saveCreditNoteSC, $scope.saveCreditNoteEC);
    };

    $scope.saveCreditNoteSC = function(data) {
        NProgress.done();
        // console.log(data);
        if (data.responseCode === "1000") {
            // $scope.skus = data.returnSkus;
            showAlert("Credit Note Saved", "success");
            $scope.invoices = [];
            $scope.selectedInvoice.invoice = "";
            $scope.skus = [];
            $scope.selectedSku = {
                "sku": {}
            };
            $scope.app = {
                "quantity": "",
            };
            $scope.batches = [];
            $scope.selectedBatch.batch = "";
        } else {
            showAlert(CONSTANT.ERROR, "Failed to save credit note");
        }
    };

    $scope.saveCreditNoteEC = function() {
        NProgress.done();
        showAlert(CONSTANT.ERROR, "Internal error. Failed to get response");
    };

    $scope.getInvoiceReturnSKUList = function() {
        $scope.getBatches();
        NProgress.start();
        var input = { "date": formatDate($scope.date.fromDate), "invoiceNo": $scope.selectedInvoice.invoice };
        console.log(input);
        DriversService.getReturnedskus(input, $scope.getInvoiceReturnSKUListSC, $scope.getInvoiceReturnSKUListEC);
    };

    $scope.getInvoiceReturnSKUListSC = function(data) {
        NProgress.done();
        // console.log(data);
        if (data.responseCode === "1000") {
            $scope.skus = data.returnSkus;
        } else {
            showAlert(CONSTANT.ERROR, "Failed to get skus");
        }
    };

    $scope.getInvoiceReturnSKUListEC = function() {
        NProgress.done();
        showAlert(CONSTANT.ERROR, "Internal error. Failed to get response");
    };

    $scope.getBatches = function() {
        NProgress.start();
        var input = { "invoiceId": $scope.selectedInvoice.invoice };
        DriversService.getInvoiceBatches(input, $scope.getBatchesSC, $scope.getBatchesEC);
    };

    $scope.getBatchesSC = function(data) {

        console.log(data);
        if (data.responseCode === "1000") {
            $scope.batches = [];
            $scope.batches = data.batches;
            if ($scope.batches.length > 0) {
                //$scope.selectedDriver.driver = $scope.drivers[0];
            } else {
                showAlert("No batches found", "success");
            }
            NProgress.done();
        } else {
            NProgress.done();
            showAlert("Failed to get batches", "error");
        }
    };

    $scope.getBatchesEC = function() {
        NProgress.done();
        showAlert("Internal Error. Failed to get invoices", "error");
    };  

    $scope.getInvoices = function() {
        NProgress.start();
        var input = { "date": formatDate($scope.date.fromDate) };
        DriversService.getReturnInvoices(input, $scope.getInvoicesSC, $scope.getInvoicesEC);
    };

    $scope.getInvoicesSC = function(data) {

        console.log(data);
        if (data.responseCode === "1000") {
            $scope.invoices = [];
            $scope.selectedInvoice.invoice = "";
            $scope.invoices = data.invoices;
            if ($scope.invoices.length > 0) {
                //$scope.selectedDriver.driver = $scope.drivers[0];
            } else {
                showAlert("No invoice found", "success");
            }
            NProgress.done();
        } else {
            NProgress.done();
            showAlert("Failed to get invoices", "error");
        }
    };

    $scope.getInvoicesEC = function() {
        NProgress.done();
        showAlert("Internal Error. Failed to get invoices", "error");
    };  

    $scope.onLoad = function() {
        //  $scope.getDrivers();
        $scope.getInvoices();
    }

    $scope.onDateChange = function() {
        $scope.invoices = [];
        $scope.selectedInvoice.invoice = "";
        $scope.skus = [];
        $scope.batches = [];
        $scope.selectedBatch.batch = "";
        $scope.onLoad();
    }

    $scope.onLoad();
}]);