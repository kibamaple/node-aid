const Is = require('../../src/utils/is');

describe('utils/is',()=>{
    
    describe('type',()=>{
        
        it('string check success',()=>{
            let value = '',
                {string} = Is;
            expect(string(value)).toBeTruthy();
        });
        
        it('string check failed',()=>{
            let value = null,
                {string} = Is;
            expect(string(value)).toBeFalsy();
        });
        
        it('object check success',()=>{
            let value = {},
                {object} = Is;
            expect(object(value)).toBeTruthy();
        });
        
        it('object check failed',()=>{
            let value = 123,
                {object} = Is;
            expect(object(value)).toBeFalsy();
        });
        
        it('array check success',()=>{
            let value = [],
                {array} = Is;
            expect(array(value)).toBeTruthy();
        });
        
        it('array check failed',()=>{
            let value = 123,
                {array} = Is;
            expect(array(value)).toBeFalsy();
        });
        
        it('base64 check success',()=>{
            let value = 'wxyzWXYZ/+==',
                {base64} = Is;
            expect(base64(value)).toBeTruthy();
        });
        
        it('base64 check failed',()=>{
            let value = 'wxyzWXYZ1234/===',
                {base64} = Is;
            expect(base64(value)).toBeFalsy();
        });
        
        it('number check success',()=>{
            let value = 123.123,
                {number} = Is;
            expect(number(value)).toBeTruthy();
        });
        
        it('number check failed',()=>{
            let value = '',
                {number} = Is;
            expect(number(value)).toBeFalsy();
        });
        
        it('boolean check success',()=>{
            let value = true,
                {boolean} = Is;
            expect(boolean(value)).toBeTruthy();
        });
        
        it('boolean check failed',()=>{
            let value = 'true',
                {boolean} = Is;
            expect(boolean(value)).toBeFalsy();
        });

        it('integer check success',()=>{
            let value = 123,
                {integer} = Is;
            expect(integer(value)).toBeTruthy();
        });
        
        it('integer check failed',()=>{
            let value = 1.23,
                {integer} = Is;
            expect(integer(value)).toBeFalsy();
        });

        it('fn check success',()=>{
            let value = ()=>{},
                {fn} = Is;
            expect(fn(value)).toBeTruthy();
        });
        
        it('fn check failed',()=>{
            let value = '',
                {fn} = Is;
            expect(fn(value)).toBeFalsy();
        });

        it('regexp check success',()=>{
            let value = /^\s$/,
                {regexp} = Is;
            expect(regexp(value)).toBeTruthy();
        });
        
        it('regexp check failed',()=>{
            let value = '',
                {regexp} = Is;
            expect(regexp(value)).toBeFalsy();
        });

        it('date check success',()=>{
            let value = new Date(),
                {date} = Is;
            expect(date(value)).toBeTruthy();
        });
        
        it('date check failed',()=>{
            let value = '',
                {date} = Is;
            expect(date(value)).toBeFalsy();
        });

        it('hex check success',()=>{
            let value = 'abcdABCD1234',
                {hex} = Is;
            expect(hex(value)).toBeTruthy();
        });
        
        it('hex check failed',()=>{
            let value = 'wxyzWXYZ1234/+==',
                {hex} = Is;
            expect(hex(value)).toBeFalsy();
        });

    });

});