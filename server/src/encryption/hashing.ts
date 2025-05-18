import { sha3_224 } from "js-sha3";

export function hash_data(data: string): string {
    return sha3_224(data);
}

export function compare_hash(data_1: string, data_2: string) {
    return data_1 === data_2;
}

