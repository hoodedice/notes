
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
    constructor(content, user, indent_style, indent_size, is_private, folder, tags, title, filetype, description, language, wrap_style) {
        this.content = content;
        this.datetime = this.getDateNow();
        this.note_id = this.generateIdentifier(this.datetime);
        this.username = user || 1;
        this.indent_size = indent_style || 0;
        this.indent_size = indent_size || 4;
        this.is_private = is_private || 0;
        this.folder = folder || "{ root }";
        this.tags = tags || "";
        this.title = title || "Untitled";
        this.filetype = filetype || "txt";
        this.description = description;
        this.language = language || "plaintext";
        this.wrap_style = wrap_style || 0;
    }

    //random ID generator : credits to https://stackoverflow.com/a/1349426
    //Date().toISOString() : credits to gustorn from the Claano Collective Discord server
    /** @private */
    getDateNow() {
        return new Date().toISOString();
    }

    getNoteForDB() {
        return new [
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