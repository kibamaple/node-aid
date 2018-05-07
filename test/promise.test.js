const Promisify = require('../src/promise');

const {promisify} = Promisify,
    error = new Error();

describe('js',()=>{
    describe('promisify',()=>{
        it('error',()=>{
            const args = [Symbol(1),Symbol(2),Symbol(3)], 
                fn = jest.fn(()=>{throw error}),
                pfn = promisify(fn);
            
            expect(pfn(...args)).rejects.toBe(error);
            expect(fn).toHaveBeenCalledTimes(1);
            expect(fn).toHaveBeenCalledWith(...args.concat([expect.anything()]));
        });
        
        it('error callback',()=>{
            const args = [Symbol(1),Symbol(2),Symbol(3)],
                fn = jest.fn((a,b,c,cb)=>cb(error)),
                pfn = promisify(fn);
            
            expect(pfn(...args)).rejects.toBe(error);
            expect(fn).toHaveBeenCalledTimes(1);
            expect(fn).toHaveBeenCalledWith(...args.concat([expect.anything()]));
        });

        it('success',()=>{
            const args = [Symbol(1),Symbol(2),Symbol(3)],
                result = Symbol('result'),
                fn = jest.fn((a,b,c,cb)=>cb(undefined,result)),
                pfn = promisify(fn);
        
            expect(pfn(...args)).resolves.toBe(result);
            expect(fn).toHaveBeenCalledTimes(1);
            expect(fn).toHaveBeenCalledWith(...args.concat([expect.anything()]));
    
        });
    });
});