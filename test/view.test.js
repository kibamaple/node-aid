const View = require('../src/view');
const {koa,koaRoute} = View,
    error = new Error(),
    errorFn = ()=>{throw error;};

describe('context',()=>{

    it('koa',async ()=>{
        const ctx = {},
            status = 123,
            body = Symbol('body'),
            respond = Symbol('respond'),
            mw = koa(respond);
        
        const res = await mw(ctx,[status,body]);
        expect(ctx).toEqual({status,body});
        expect(res).toBe(respond);
    });

    describe('koa route',()=>{

        it('not found',async ()=>{
            const method = Symbol('method'),
                view = Symbol('view'),
                opts = [Symbol('opt'),Symbol('opt1'),Symbol('opt2')],
                route = jest.fn(),
                mw = koaRoute(route);
            
            const res = await mw({method},[view,...opts]);

            expect(route).toHaveBeenCalledTimes(1);
            expect(route).toHaveBeenCalledWith(view,method);
            expect(res).toBeUndefined();
        });
        
        it('route error',async ()=>{
            const method = Symbol('method'),
                view = Symbol('view'),
                opts = [Symbol('opt'),Symbol('opt1'),Symbol('opt2')],
                route = jest.fn(errorFn),
                mw = koaRoute(route);
            
            let res,err;
            try{
                res = await mw({method},[view,...opts]);
            }catch(e){
                err = e;
            }

            expect(err).toBe(error);
            expect(route).toHaveBeenCalledTimes(1);
            expect(route).toHaveBeenCalledWith(view,method);
            expect(res).toBeUndefined();
        });
        
        it('action error',async ()=>{
            const method = Symbol('method'),
                view = Symbol('view'),
                opts = [Symbol('opt'),Symbol('opt1'),Symbol('opt2')],
                route = jest.fn(),
                action = jest.fn(errorFn),
                ctx = {method},
                mw = koaRoute(route);
            
            route.mockReturnValue(action);
            let res,err;
            try{
                res = await mw(ctx,[view,...opts]);
            }catch(e){
                err = e;
            }

            expect(err).toBe(error);
            expect(route).toHaveBeenCalledTimes(1);
            expect(route).toHaveBeenCalledWith(view,method);
            expect(action).toHaveBeenCalledTimes(1);
            expect(action).toHaveBeenCalledWith(ctx,...opts);
            expect(res).toBeUndefined();
        });

        it('success',async ()=>{
            const method = Symbol('method'),
                view = Symbol('view'),
                opts = [Symbol('opt'),Symbol('opt1'),Symbol('opt2')],
                route = jest.fn(),
                action = jest.fn(),
                resp = Symbol('resp'),
                ctx = {method},
                mw = koaRoute(route);
        
            route.mockReturnValue(action);
            action.mockReturnValue(resp);
            const res = await mw(ctx,[view,...opts]);

            expect(route).toHaveBeenCalledTimes(1);
            expect(route).toHaveBeenCalledWith(view,method);
            expect(action).toHaveBeenCalledTimes(1);
            expect(action).toHaveBeenCalledWith(ctx,...opts);
            expect(res).toBe(resp);
        });
    });

});