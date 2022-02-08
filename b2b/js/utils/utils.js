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
 
var formatDate_ddMMyyyy = function(dateStr) {
	var date = new Date(dateStr);
	var formattedDate = date.toString("dd-MM-yyyy hh:mm:ss");
	return date;
}