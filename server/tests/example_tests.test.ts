/* 
** GENERAL INFO
**
** These are some examples of how to write tests with Jest!
*/


/* 
** A more simple test
*/

import { sum } from './../src/example_tests_src';

test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
});
  

/* 
** Testing Async data
*/

import { fetchData } from './../src/example_tests_src';

test('fetchData returns data', (done) => {
    function callback(data: string): void {
        expect(data).toBe('data');
        done();
    }
    fetchData(callback);
});


