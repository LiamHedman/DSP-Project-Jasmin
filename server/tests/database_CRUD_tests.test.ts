import insert_data from "../src/database/data_insertion";
import retrieve_data from "../src/database/data_retrieval";
import modify_data from "../src/database/data_modification";
import delete_data from "../src/database/data_deletion";
import clear_table from "../src/database/table_clearing";

const tableName = "test_table";

const insertion_data = {
    column_1: "Exempel",
    column_2: "exempel@exempel.boomer",
    column_3: 99,
};

const new_data = {
    column_1: "Exempel",
    column_2: "exempel@exempel.boomer",
    column_3: 1234567890
};

beforeEach(async () => {
    await clear_table(tableName);
});

test("Retrieve inserted data", async () => {
    await insert_data(tableName, insertion_data);
    const retrieved_data = await retrieve_data(tableName, insertion_data);
    
    expect(retrieved_data).toContainEqual(insertion_data);
});

test("Modify data and verify", async () => {
    await insert_data(tableName, insertion_data);
    await modify_data(tableName, new_data, insertion_data);
    const modified_data = await retrieve_data(tableName, new_data);

    expect(modified_data).toContainEqual(new_data);
});

test("Delete data and ensure its gone", async () => {
    await insert_data(tableName, insertion_data);
    await delete_data(tableName, insertion_data);
    const data = await retrieve_data(tableName, insertion_data);

    expect(data.length).toBe(0);
});