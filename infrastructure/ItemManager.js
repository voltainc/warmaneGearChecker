const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/' + process.env.sqlite_database_name, sqlite3.OPEN_READONLY);

function GetItems(itemList, callback) {
    const query = `SELECT * FROM items WHERE itemID IN (${itemList.join(", ")})`;

    db.all(query, (err, rows) => {
        if (err) {
            callback(err, null);
            return;
        }

        callback(null, rows)
    });
}

module.exports = { GetItems }