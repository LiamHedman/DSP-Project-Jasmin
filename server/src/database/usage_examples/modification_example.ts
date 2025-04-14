import modify_data from "../data_modification";

// Function MUST be async to not block the programs event loop,
// very important
const main = async () => {
    // Please use the "try and catch" method to ease error-handling
    try {
        const tableName = "example_table";
        
        // Condition for which row(s) to update
        const criteria = {
            column_1: "Exempel", // Usually some identifier (ex. primary key)
            column_2: "exempel@exempel.boomer",
        };
        
        // The new data to be updated in the database
        const newData = {
            column_1: "Updated Example",
            column_2: "updated@exempel.boomer",
            column_3: 100,
        };
        
        // Update the data in the specified table
        // use AWAIT!
        await modify_data(tableName, newData, criteria);

    } catch (err) {
        console.error("[ERROR]: Error at updating example", err);
    }
};

main();