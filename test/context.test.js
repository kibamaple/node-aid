const Context = require('../src/context');
const {koa} = Context;

describe('context',()=>{

    describe('koa',()=>{
        
        it('normal',()=>{
            const param1 = Symbol('param1'),
                param2 = Symbol('param2'),
                param3 = Symbol('param3'),
                query = {param1}, 
                body = {param2},
                state = {param3},
                ctx = {state,request:{body},query},
                app = jest.fn(),
                context = koa(app,ctx);
            
            expect(context).toEqual({param1,param2,param3});
            expect(app).toHaveBeenCalledTimes(0);
        });

        it('override',()=>{
            const param1 = Symbol('param1'),
                param2 = Symbol('param2'),
                param3 = Symbol('param3'),
                query = {param1}, 
                body = {param2:Symbol()},
                state = {param2,param3},
                ctx = {state,request:{body},query}
                app = jest.fn(),
                context = koa(app,ctx);
            
            expect(context).toEqual({param1,param2,param3});
            expect(app).toHaveBeenCalledTimes(0);
        });

        it('app $params',()=>{
            const param1 = Symbol('param1'),
                param2 = Symbol('param2'),
                param3 = Symbol('param3'),
                query = {param1}, 
                body = {param2:Symbol()},
                state = {param2,param3},
                ctx = {state,request:{body},query}
                $params = {body:['param2'],query:['param1']},
                app = jest.fn();
                
            app.$params = $params;
            const context = koa(app,ctx);
            
            expect(context).toEqual({param1,param2:body.param2});
            expect(app).toHaveBeenCalledTimes(0);
        });

    });

});