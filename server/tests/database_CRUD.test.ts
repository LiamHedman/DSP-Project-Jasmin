import insert_data from '../database/data_insertion.js';
import retrieve_data from '../database/data_retrieval.js';
import modify_data from '../database/data_modification.js';
import delete_data from '../database/data_deletion.js';

const tableName = "test_table";

const insertion_data = {
    column_1: "Exempel",
    column_2: "exempel@exempel.boomer",
    column_3: 99,
};

const conditions = insertion_data;

// Testing the retrieval of data
const test_retrieve = async () => {
    try {
        await insert_data(tableName, insertion_data);
        const retrieved_data = await retrieve_data(tableName, conditions);
        
        expect(retrieved_data.toequal(insertion_data));

    } catch (err) {
        console.error("[ERROR]: Error at insertion/retrieval of data", err);
    }
};

// Testing the mdoification of data
const test_modification = async () => {
    try {
        const new_data = {
            column_1: "Exempel",
            column_2: "exempel@exempel.boomer",
            column_3: "1234567890"
        };
        
        await insert_data(tableName, insertion_data);
        await modify_data(tableName, new_data, conditions);
        const modified_data = await retrieve_data(tableName, new_data);
        
        expect(modified_data.toequal(new_data));
        
    } catch (err) {
        console.error("[ERROR]: Error at insertion/retrieval of data", err);
    }
};

// Testing the deletion of data
const test_deletion = async () => {
    try {
        
        const new_data = {
            column_1: "Exempel",
            column_2: "exempel@exempel.boomer",
            column_3: "1234567890"
        };
        
        await insert_data(tableName, insertion_data);
        await delete_data(tableName, conditions);
        const data = await retrieve_data(tableName, new_data);
        
        // Checks that the data array is size 0 (an empty array since no data should have been retrieved)
        expect(data.size().tobe(0));
        
    } catch (err) {
        console.error("[ERROR]: Error at insertion/retrieval of data", err);
    }
};

test_retrieve();
test_modification();
test_deletion();