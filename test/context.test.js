const Context = require('../src/context');
const {koa} = Context;

describe('context',()=>{

    describe('koa',()=>{
        
        it('normal',()=>{
            const param1 = Symbol('param1'),
                param2 = Symbol('param2'),
                param3 = Symbol('param3'),
                query = {param1}, 
                fields = {param2},
                state = {param3},
                ctx = {state,request:{fields},query},
                app = jest.fn(),
                context = koa(app,ctx);
            
            expect(context.param1).toBe(param1);
            expect(context.param2).toBe(param2);
            expect(context.param3).toBe(param3);
            expect(app).toHaveBeenCalledTimes(0);
        });

        it('override',()=>{
            const param1 = Symbol('param1'),
                param2 = Symbol('param2'),
                param3 = Symbol('param3'),
                query = {param1}, 
                fields = {param2:Symbol()},
                state = {param2,param3},
                ctx = {state,request:{fields},query}
                app = jest.fn(),
                context = koa(app,ctx);
            
                expect(context.param1).toBe(param1);
                expect(context.param2).toBe(param2);
                expect(context.param3).toBe(param3);
                expect(app).toHaveBeenCalledTimes(0);
        });

        it('app assign',()=>{
            const param1 = Symbol('param1'),
                param2 = Symbol('param2'),
                param3 = Symbol('param3'),
                query = {param1}, 
                fields = {param2:Symbol()},
                state = {param2,param3},
                ctx = {state,request:{fields},query}
                $params = {fields:['param2'],query:['param1'],state:['param2']},
                app = jest.fn();
                
            app.$params = $params;
            const context = koa(app,ctx);
            
            expect(context).toEqual({param1,param2:fields.param2});
            expect(app).toHaveBeenCalledTimes(0);
        });

    });

});