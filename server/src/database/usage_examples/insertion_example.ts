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

        const supply_post = {
            id: 20,    // ID
            owner_id: 10,    // Owner ID
            title: "title",   // title
            description: "bio",    // description
            price: 199,    // price
            category: "category",   // category
            location: "location",   // location
            post_picture_url: "post_picture_url",   // post_picture_url
            created_at: "created_at"    // created at
        };

        const tableName = "active_supply_posts";

        // Insertion of the data into the table specified
        // use AWAIT!
        await insert_data(tableName, supply_post);

    } catch (err) {
        console.error("[ERROR]: Error at insertion of example", err);
    }
};

main();
