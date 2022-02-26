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

constants.constant('CONSTANT', {
    PENDING_VIEW: 100,
    COMPLETED_VIEW: 101,
    TURNAWAY_VIEW: 102,
    ONGOING_VIEW: 103,
    REFRESH_CURRENT_VIEW: 104,
    AFTER_DELETE_REFRESH: 105,
    UNASSIGNED_VIEW: 106,
    UNASSIGNED_STATUS: "UA",
    ASSIGNED: "AS",
    REACHED: "AS-RC",
    PBB3_COLLECT_PARCEL: "AS-RC-CP",
    PBB3_START_TRIP: "AS-RC-CP-ST",
    PBB3_END_TRIP: "AS-RC-CP-ST-ET",
    PBB3_COMPLETED: "AS-RC-CP-ST-ET-CA",
    START_TRIP: "AS-ST",
    END_TRIP: "AS-ST-ET",
    COMPLETED: "AS-ST-ET-CA",
    SHIPMENTS_MAX: 50,
    COMPLETED_LOCATION: 1,
    ON_TRIP_LOCATION: 2,
    QSTART_TRIP: "ST",
    QEND_TRIP: "ST-ET",
    KEY: "a2lJcExpbkdjT29wTGluZw==",
    ONLINE_DRIVERS: 1,
    OFFLINE_DRIVERS: 2,
    ALL_DRIVERS: 5,
    COMPLETED_TRIPS: 4,
    IN_JOB: 3,
    MUMBAI: 1,
    DELHI: 2,
    ALL_CITY: 3,
    CLIENT_ID: "",
    CLIENT_SECRET: "",
    ALL_SHIPMENTS: 0,
    CREATED_SHIPMENTS: 1,
    COMPLETED_SHIPMENTS: 2,
    ONGOING_SHIPMENTS: 3,
    PENDING_SHIPMENTS: 4,
    TURNEDAWAY_SHIPMENTS: 5,
    UNASSIGNED_SHIPMENTS: 6,
    EXPIRED_SHIPMENTS: 7,
    CANCELED_SHIPMENTS: 8,
    PC_SHIPMENTS: 13,
    FC_SHIPMENTS: 12,
    IR_SHIPMENTS: 10,
    DRIVER: 1,
    MANAGER: 2,
    APP_USER: 3,
    ALL: "ALL",
    INCLUDE_OP_DRIVERS: 0,
    EXCLUDE_OP_DRIVERS: 1,
    MYNTRA_DEV: 5011,
    MYNTRA_LIVE: 2516,
    JIO_INP: "jioInp",
    PICKED_SHIPMENTS: 1,
    RETURNED_SHIPMENTS: 2,
    ASSIGNED_SHIPMENTS: 11,
    SUCCESS: "success",
    INFO: "info",
    ERROR: "error"
});

constants.constant('APP', {
    DONE: 1,
    BITE_CLUB: 3,
    MYGENIE: 4,
    ONE_TOUCH: 5,
    DUNIYA: 2,
    FOOD_FEAST: 1,
    NATURAL_ICECREAM: 1,
    PARSEL_QUANTUM: 6
});
constants.constant('CITIES', {
    city_list: [
        { name: 'PALWAL' },
        { name: 'BALLABHGARH' },
        { name: 'SOHNA' },
        { name: 'MANESAR' }
    ]
});

constants.constant('MANAGER_TYPES', {
    manager_list: [
        { name: 'Ops Manager' },
        { name: 'DC Manager' },
        { name: 'Dispatch Executive' }
    ]
});