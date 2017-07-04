'use strict';

var Query = require('bazalt-query');

// Translator class
class Translator {

    constructor(query) {
        if(
            null  === query || 
            false === query instanceof Query
        ) {
            throw new Error('Translator accepts only Query instance.');
        }

        this.$__query      = query;
        this.$__sql        = '';
        this.$__parameters = [];
        this.$__translated = false;
    }

    // Generate the list of arguments
    get parameters() {
        // Try to generate if not
        this.generate();

        return this.$__parameters;
    }

    get sql() {
        // Try to generate if not
        this.generate();

        return this.$__sql;
    }

    // Generate the SQL query
    generate() {
        if(true === this.$__translated) {
            return;
        }

        // Set translated
        this.$__translated = true;

        var obj = this.$__query.toObject();

        // Add model argument by default
        this.$__parameters.push(obj.model);

        switch(obj.action) {
            case Query.Actions.Create:
                this.$__sql += 'INSERT INTO ?? SET ?';

                // Add values argument
                this.$__parameters.push(obj.values);

                // Remove extra informations
                delete obj.criteria;
                delete obj.limit;

                break;

            case Query.Actions.FindOne:
            case Query.Actions.Find:
                this.$__sql += 'SELECT * FROM ??';

                // Force the limit
                if(Query.Actions.FindOne === obj.action) {
                    obj.limit = 1;
                }

                break;

            case Query.Actions.Update:
                this.$__sql += 'UPDATE ?? SET ?';
                
                // Add values argument
                this.$__parameters.push(obj.values);

                break;

            case Query.Actions.Destroy:
                this.$__sql += 'DELETE FROM ??';

                break;

            default: 
                throw new Error('The given Query is not supported.');
        }

        // Add criteria if needed
        if(obj.criteria)
        {
            let i = 0;

            for(let field in obj.criteria)
            {
                if(0 === i)
                {
                    this.$__sql += ' WHERE ?';
                }
                else
                {
                    this.$__sql += ' AND ?';
                }

                this.$__parameters.push({
                    [field]: obj.criteria[field]
                });

                i++;
            }
        }

        // Add sort if needed
        if(obj.sort)
        {
            for(let i in obj.sort)
            {
                if(0 == i)
                {
                    this.$__sql += ' ORDER BY ??';
                }
                else
                {
                    this.$__sql += ', ??';
                }

                switch(obj.sort[i][1])
                {
                    case 1:
                        this.$__sql += ' ASC';
                        break;
                    case -1:
                        this.$__sql += ' DESC';
                        break;
                }

                this.$__parameters.push(obj.sort[i][0]);
            }
        }

        // Add limit with offset if needed
        if(
            'undefined' !== typeof obj.limit &&
            'undefined' !== typeof obj.offset
        ) {
            this.$__sql += ' LIMIT ?, ?';

            this.$__parameters.push(obj.offset);
            this.$__parameters.push(obj.limit);
        }
        // Add limit without offset if needed
        else if(
            'undefined' !== typeof obj.limit &&
            'undefined' === typeof obj.offset
        ) {
            this.$__sql += ' LIMIT 0, ?';

            this.$__parameters.push(obj.limit);
        }
    }
}

// Export Translator
module.exports = Translator;
