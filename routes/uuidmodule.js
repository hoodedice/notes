function getCurrentDate() {
    var TimeStampNow = new Date();
    var thisMonth = TimeStampNow.getMonth() + 1;
    if (thisMonth < 10) thisMonth = "0" + thisMonth;
    var thisNotesTimeStamp = TimeStampNow.getFullYear() + "" + 
        (thisMonth) + "" + 
        TimeStampNow.getDate();
        
    return thisNotesTimeStamp;
}

// https://stackoverflow.com/a/1349426
function getRandomIdentifier() {
    var identifier = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_";
  
    for (var i = 0; i < 6; i++)
      identifier += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return identifier;
}

module.exports.generateUUID = function generateUUID() {
    return getCurrentDate() + getRandomIdentifier();
}