if (Element.prototype.getAttributeNames == undefined) {
  Element.prototype.getAttributeNames = function () {
    var attributes = this.attributes;
    var length = attributes.length;
    var result = new Array(length);
    for (var i = 0; i < length; i++) {
      result[i] = attributes[i].name;
    }
    return result;
  };
}

//TODO: 

let datetimes = document.getElementsByClassName("datetime-container");
for (datetime of datetimes) {

  let dt = datetime.getElementsByClassName("datetime")[0];

  let dtutcnode = datetime.getElementsByClassName("datetimeUTC")[0];
  dtutc = new Date(dtutcnode.textContent);

  let clientDT = new Date(Date.UTC(dtutc.getFullYear(), dtutc.getMonth(), dtutc.getDate(), dtutc.getHours(), dtutc.getMinutes(), dtutc.getSeconds()));

  dtutcnode.textContent = clientDT;

  dt.style.display = "none";

  dtutcnode.setAttribute("class", "datetime");

}