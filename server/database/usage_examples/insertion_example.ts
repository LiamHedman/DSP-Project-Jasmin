import insert_data from '../data_insertion.js';


// Function MUST be async to not block the programs event loop,
// very important
const main = async () => {
    // Please use the "try and catch" method to ease error-handling
    try {

        // The data to be inserted into the database
        // If JSON-formatted: use JSON.parse()
        // The names of the columns must match the columns on the database,
        // same goes for the types of data inserted
        const data = {
            column_1: "Exempel",
            column_2: "exempel@exempel.boomer",
            column_3: 99,
        };

        const tableName = "example_table";

        // Insertion of the data into the table specified
        // use AWAIT!
        await insert_data(tableName, data);

    } catch (err) {
        console.error("[ERROR]: Error at insertion of example", err);
    }
};

main();
