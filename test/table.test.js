const Table = require('@/table');

describe('table',()=>{

    describe('length',()=>{
        
        it('count normal',()=>{
            let table = [1,2,3],
                {count} = Table;
            expect(count(table)).toBe(table.length);
        });

        it('check true',()=>{
            let table = [1,2,3],
                {check} = Table,
                fn = check(3);
            expect(fn((table))).toBeTruthy()
        });
    
        it('check false',()=>{
            let table = [1,2,3],
                {check} = Table,
                fn = check(4);
            expect(fn(table)).toBeFalsy()
        });

        it('empty true',()=>{
            let table = [],
                {empty} = Table;
            expect(empty(table)).toBeTruthy()
        });

        it('empty false',()=>{
            let table = [1,2,3],
                {empty} = Table;
            expect(empty(table)).toBeFalsy()
        });

    });

    describe('row',()=>{

        it('search',()=>{
            let table = [1,2,3],
                {search} = Table,
                fn = search(1);
            expect(fn(table)).toBe(table[1]);
        });

        it('top',()=>{
            let table = [1,2,3],
                {top} = Table;
            expect(top(table)).toBe(table[0]);
        });

    });

    describe('col',()=>{

        it('match',()=>{
            let table = [
                    [1,2,3],
                    [4,5,6],
                    [7,8,9],
                ],
                {match} = Table,
                fn = match(1);
            expect(fn(table)).toEqual([2,5,8]);
        });

    });

    describe('field',()=>{
        
        it('get',()=>{
            let table = [
                    [1,2,3],
                    [4,5,6],
                    [7,8,9],
                ],
                {get} = Table,
                fn = get(1,1);
            expect(fn(table)).toEqual(table[1][1]);
        });

        it('first',()=>{
            let table = [
                    [1,2,3],
                    [4,5,6],
                    [7,8,9],
                ],
                {first} = Table,
                fn = first(1);
            expect(fn(table)).toEqual(table[0][1]);
        });

    });
});