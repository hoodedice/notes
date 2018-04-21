
module.exports.User = class {
  constructor(username, email, id, fname, lname, join_date) {
    this.id = id || 0;
    this.username = username;
    this.email = email;
    this.fname = fname || null;
    this.lname = lname || null;
    this.join_date = join_date || this.getDateNow();
  }

  getDateNow() {
    let datetime = new Date().toISOString();
    return datetime.slice(0, 20);
  }

}
