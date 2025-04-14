import delete_data from "../data_deletion.js";


// Function MUST be async to not block the programs event loop,
// very important
const main = async () => {
    // Please use the "try and catch" method to ease error-handling
    try {

        // The criterias for deletion
        // The function DELETES ALL entries matching the criteria
        const criteria = {
            column_1: "Exempel",
        };

        const tableName = "example_table";

        // Deletion of the data
        await delete_data(tableName, criteria);

    } catch (err) {
        console.error("[ERROR]: Error at deletion of example", err);
    }
};

main();