import retrieve_data from './data_retrieval.js';

// Function MUST be async to not block the programs event loop,
// very important
const main = async () => {
    // Please use the "try and catch" method to ease error-handling
    try {

        // The criterias to filter on
        // The function returns an array of ALL matching data
        const criteria = {
            column_1: "Exempel",
            column_2: "exempel@exempel.boomer",
        };

        const tableName = "example_table";

        // Retrieval of the data
        await retrieve_data(tableName, criteria);

    } catch (err) {
        console.error("[ERROR]: Error at insertion of example", err);
    }
};

main();