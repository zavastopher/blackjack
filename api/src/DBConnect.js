//Implement mySQL
const mariaDB = require('mysql');

let connection;

/**
 * This method makes the connection to the database
 * @returns the database connection
 */
exports.getConnection = () => {
    console.log("In getConnection");
    //If there is no connection
    if (!connection) {
        //Make the MySQL pool
        connection = mariaDB.createPool({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
            charset: process.env.DB_CHARSET
        });
    }
    return connection;
};

/**
 * Method closes the connection
 */
exports.close = () => {
    console.log("In close");
    //If there is a connection
    if (connection) {
        //end the connection
        connection.end();
        connection = null;
    }
};

/**
 * Method queries the connection
 * @param {*} query the query for the connection
 * @param {*} params the parameters passed in the connection
 * @returns if an error occurs during query
 */
exports.query = (query, params = []) => {
    console.log("In query");
    return new Promise((resolve, reject) => {
        //If there is no connection
        if (!connection) {
            //Make the connection
            connection = exports.getConnection();
        }
        connection.query(query, params, (err, results, fields) => {
            //If an error occurs during query
            if (err) {
                //Reject with the error
                reject(err);
                //Return
                return;
            }
            resolve({
                results: results,
                fields: fields
            })
        })
    });
};
