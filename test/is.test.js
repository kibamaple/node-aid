const Is = require('../src/is');
const {
    string,
    object,
    array,
    base64,
    number,
    boolean,
    integer,
    fn,
    regexp,
    hex,
    date,
    undef
} = Is;

describe('is',()=>{
        
    it('string check success',()=>{
        expect(string('')).toBeTruthy();
    });
    
    it('string check failed',()=>{
        expect(string(null)).toBeFalsy();
    });
    
    it('object check success',()=>{
        expect(object({})).toBeTruthy();
    });
    
    it('object check failed',()=>{
        expect(object(123)).toBeFalsy();
    });
    
    it('array check success',()=>{
        expect(array([])).toBeTruthy();
    });
    
    it('array check failed',()=>{
        expect(array(123)).toBeFalsy();
    });
    
    it('base64 check success',()=>{
        expect(base64('wxyzWXYZ/+==')).toBeTruthy();
    });
    
    it('base64 check failed',()=>{
        expect(base64('wxyzWXYZ1234/===')).toBeFalsy();
    });
    
    it('number check success',()=>{
        expect(number(123.123)).toBeTruthy();
    });
    
    it('number check failed',()=>{
        expect(number('')).toBeFalsy();
    });
    
    it('boolean check success',()=>{
        expect(boolean(true)).toBeTruthy();
    });
    
    it('boolean check failed',()=>{
        expect(boolean('true')).toBeFalsy();
    });

    it('integer check success',()=>{
        expect(integer(123)).toBeTruthy();
    });
    
    it('integer check failed',()=>{
        expect(integer(1.23)).toBeFalsy();
    });

    it('fn check success',()=>{
        expect(fn(()=>{})).toBeTruthy();
    });
    
    it('fn check failed',()=>{
        expect(fn('')).toBeFalsy();
    });

    it('regexp check success',()=>{
        expect(regexp(/^\s$/)).toBeTruthy();
    });
    
    it('regexp check failed',()=>{
        expect(regexp('')).toBeFalsy();
    });

    it('date check success',()=>{
        expect(date(new Date())).toBeTruthy();
    });
    
    it('date check failed',()=>{
        expect(date('')).toBeFalsy();
    });

    it('hex check success',()=>{
        expect(hex('abcdABCD1234')).toBeTruthy();
    });
    
    it('hex check failed',()=>{
        expect(hex('wxyzWXYZ1234/+==')).toBeFalsy();
    });
    
    it('undefined check success',()=>{
        expect(undef(undefined)).toBeTruthy();
    });
    
    it('undefined check failed',()=>{
        expect(undef('wxyzWXYZ1234/+==')).toBeFalsy();
    });

});