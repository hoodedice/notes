/**@deprecated */
getCurrentDate = function() {
    var TimeStampNow = new Date();
    var thisDate = TimeStampNow.getUTCDate();
    var thisMonth = TimeStampNow.getUTCMonth() + 1;
    if (thisMonth < 10) thisMonth = "0" + thisMonth;
    if (thisDate < 10) thisDate = "0" + thisDate;
    var thisNotesTimeStamp = TimeStampNow.getUTCFullYear() + "" + 
        thisMonth + "" + 
        thisDate;
        
    return thisNotesTimeStamp;
}

/** @deprecated */
module.exports.getCurrentDateTime = function() {
    var DateTimeStampNow = new Date();

    var thisDate = DateTimeStampNow.getUTCDate();
    var thisMonth = DateTimeStampNow.getUTCMonth() + 1;
    if (thisMonth < 10) thisMonth = "0" + thisMonth;
    if (thisDate < 10) thisDate = "0" + thisDate;
    var thisNotesTimeStamp = DateTimeStampNow.getUTCFullYear() + "-" + 
        thisMonth + "-" + 
        thisDate + " " + 
        DateTimeStampNow.getUTCHours() + ":" +
        DateTimeStampNow.getUTCMinutes() + ":" + 
        DateTimeStampNow.getUTCSeconds();
        
    console.log("The datetime now is " + DateTimeStampNow);
    return thisNotesTimeStamp;
}

/** @deprecated */
// https://stackoverflow.com/a/1349426
function getRandomIdentifier() {
    var identifier = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_";
  
    for (var i = 0; i < 6; i++)
      identifier += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return identifier;
}

/** @deprecated */
module.exports.generateUUID = function generateUUID() {
    return getCurrentDate() + getRandomIdentifier();
}