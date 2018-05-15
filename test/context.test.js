const Context = require('../src/context');

describe('context',()=>{
 
    it('normal',()=>{
        const param1 = Symbol('param1'),
            param2 = Symbol('param2'),
            param3 = Symbol('param3'),
            context = Context(undefined,{param1},{param2},{param3});
        
        expect(context.param1).toBe(param1);
        expect(context.param2).toBe(param2);
        expect(context.param3).toBe(param3);
    });

    it('normal with mapping',()=>{
        const param1 = Symbol('param1'),
            param2 = Symbol('param2'),
            param3 = Symbol('param3'),
            param4 = Symbol('param4'),
            context = Context({param6:['param5','param4']},{param1},{param2},{param3,param4});
        
        expect(context.param1).toBe(param1);
        expect(context.param2).toBe(param2);
        expect(context.param3).toBe(param3);
        expect(context.param6).toBe(param4);
    });

    it('override',()=>{
        const param1 = Symbol('param1'),
            param2 = Symbol('param2'),
            param3 = Symbol('param3'),
            context = Context(undefined,{param1},{param2,param3},{param2:Symbol()});
        
            expect(context.param1).toBe(param1);
            expect(context.param2).toBe(param2);
            expect(context.param3).toBe(param3);
    });

    
    it('override with mapping',()=>{
        const param1 = Symbol('param1'),
            param2 = Symbol('param2'),
            param3 = Symbol('param3'),
            param4 = Symbol('param4'),
            context = Context({param6:['param5','param4']},{param1},{param2},{param3,param4},{param4:Symbol()});
        
        expect(context.param1).toBe(param1);
        expect(context.param2).toBe(param2);
        expect(context.param3).toBe(param3);
        expect(context.param6).toBe(param4);
    });
});