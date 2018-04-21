
/** Class representing a Note */
module.exports.Note = class {
    /**
     * @param {string} content
     * @param {user=} [user]
     *      user object of the person uploading the Note
     * @param {boolean=} [indent_style]
     * @param {number=} [indent_size]
     * @param {boolean=} [is_private]
     * @param {JSON=} [folder]
     * @param {JSON=} [tags]
     * @param {string=} [title]
     * @param {string=} [filetype]
     * @param {string=} [description]
     * @param {string=} [language]
     * @param {boolean=} [wrap_style]
     */
    constructor(content, username, indent_style, 
        indent_size, is_private, folder, tags, title, filetype, description,
        language, wrap_style, datetime, note_id) {
        this.content = content;
        this.datetime = datetime || this.getDateNow();
        this.note_id = note_id || this.generateIdentifier(this.datetime);
        this.username = user || 1;
        this.indent_style = indent_style || 0;
        this.indent_size = indent_size || 4;
        this.is_private = is_private || 0;
        this.folder = folder || { "root" : [] };
        this.tags = tags || "{}";
        this.title = title || "Untitled";
        this.filetype = filetype || "txt";
        this.description = description;
        this.language = language || "";
        this.wrap_style = wrap_style || 0;
    }

    //random ID generator : credits to https://stackoverflow.com/a/1349426
    //Date().toISOString() : credits to gustorn from the Claano Collective Discord server
    /** @private */
    getDateNow() {
        let datetime = new Date().toISOString();
        return datetime.slice(0, 20);
    }

    getNoteForDB() {
        let contents = [
            this.note_id, 
            this.datetime, 
            this.content, 
            this.title,
            this.filetype,
            this.description,
            this.language,
            this.wrap_style,
            this.indent_style,
            this.indent_size,
            this.is_private,
            this.folder,
            this.tags
        ];
        //force undefined or empty string to be null, since mysql2 requires JS null
        var key = ""
        for (key in contents) {
            //console.log("before: " + contents[key]);
            if (contents[key] == null || contents[key] === "") {
                contents[key] = null; 
            }
            //TODO: remove
            contents.language = 0;
            //console.log(contents[key]);
        }
        return contents;
    }

    /** @private */
    generateIdentifier(DateTimeNow) {
        let DateNow = DateTimeNow.split('T', 1);
        let arrayDateNow = DateNow[0].split('-');
        DateNow = arrayDateNow.join('');
        //console.log(DateNow);
        var identifier = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_";

        for (var i = 0; i < 6; i++) {
            identifier += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return DateNow + identifier;
    }


}