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
 
function loaderStart() {
    $('#loaderdiv').show();
}

function loaderStop() {
    $('#loaderdiv').hide();
}

function uploaderStart() {
    $('#uploaderdiv').show();
}

function uploaderStop() {
    $('#uploaderdiv').hide();
}

function formatDate(selectedDate) {
    var d = selectedDate;
    var month = '' + (d.getMonth() + 1);
    var day = '' + d.getDate();
    var year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

function getHoursFromMins(mins) {
    var hours = Math.floor( Number(mins) / 60);  
    var minutes = Number(mins) % 60;
    if (minutes > 0) {
        return hours + " hrs " + minutes + " mins ";
    } else {
        return hours + " hrs ";
    }
}

function formatDateDDMMYYYY(selectedDate) {
    var d = selectedDate;
    var month = '' + (d.getMonth() + 1);
    var day = '' + d.getDate();
    var year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [day, month, year].join('-');
}

function formatHours(selectedDate) {
    var d = new Date(selectedDate);

    var hrs = '' + d.getHours();
    var mins = '' + d.getMinutes();
    var secs = '00'
    
    if (hrs.length < 2) hrs = '0' + hrs;
    if (mins.length < 2) mins = '0' + mins;
    
    return hrs + ":" + mins + ":" + secs;
}

function formatDateTime(selectedDate) {
    var d = new Date(selectedDate);
    
    var month = '' + (d.getMonth() + 1);
    var day = '' + d.getDate();
    var year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    var time = new Date(selectedDate);

    var hrs = '' + time.getHours();
    var mins = '' + time.getMinutes();
    var secs = '' + time.getSeconds();
    
    if (hrs.length < 2) hrs = '0' + hrs;
    if (mins.length < 2) mins = '0' + mins;
    if (secs.length < 2) secs = '0' + secs;
    
    return day + "-" + month + "-" + year + " " + hrs + ":" + mins + ":" + secs;
}

function toKms(distanceTravelled) {
    if (!isNaN(distanceTravelled)) {
        distanceTravelled = Number(distanceTravelled) / 1000;
        return Number(Math.round(distanceTravelled * 10) / 10) + " Kms";
    }
}

function generateIdentifier() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}