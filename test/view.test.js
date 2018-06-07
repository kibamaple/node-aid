const View = require('@/view');
const error = new Error(),
    errorFn = ()=>{throw error;};

describe('context',()=>{

    it('base',async ()=>{
        const ctx = Symbol('ctx'),
            res = Symbol('res'),
            view = View();
        
        const r = await view(ctx,res);
        expect(r).toBe(res);
    });

    it('value',async ()=>{
        const ctx = Symbol('ctx'),
            res = Symbol('res'),
            value = Symbol('value'),
            view = View(value);
        
        const r = await view(ctx,res);
        expect(r).toBe(value);
    });

    it('not found',async ()=>{
        const ctx = Symbol('ctx'),
            r_ctx = Symbol('r_ctx'),
            args = [Symbol('arg1'),Symbol('arg2'),Symbol('arg3')],
            route = jest.fn(),
            view = View(route);
        
        const res = await view(ctx,[r_ctx,...args]);

        expect(route).toHaveBeenCalledTimes(1);
        expect(route).toHaveBeenCalledWith(r_ctx);
        expect(res).toBeUndefined();
    });

    it('route error',async ()=>{
        const ctx = Symbol('ctx'),
            r_ctx = Symbol('r_ctx'),
            args = [Symbol('arg1'),Symbol('arg2'),Symbol('arg3')],
            route = jest.fn(errorFn),
            view = View(route);

        let res,err;
        try{
            res = await view(ctx,[r_ctx,...args]);
        }catch(e){
            err = e;
        }

        expect(err).toBe(error);
        expect(route).toHaveBeenCalledTimes(1);
        expect(route).toHaveBeenCalledWith(r_ctx);
        expect(res).toBeUndefined();

    });

    it('action error',async ()=>{
        const ctx = Symbol('ctx'),
            r_ctx = Symbol('r_ctx'),
            args = [Symbol('arg1'),Symbol('arg2'),Symbol('arg3')],
            route = jest.fn(),
            action = jest.fn(errorFn),
            view = View(route);

        route.mockReturnValue(action);
        let res,err;
        try{
            res = await view(ctx,[r_ctx,...args]);
        }catch(e){
            err = e;
        }

        expect(err).toBe(error);
        expect(route).toHaveBeenCalledTimes(1);
        expect(route).toHaveBeenCalledWith(r_ctx);
        expect(action).toHaveBeenCalledTimes(1);
        expect(action).toHaveBeenCalledWith(ctx,...args);
        expect(res).toBeUndefined();
    });

    it('success',async ()=>{
        const ctx = Symbol('ctx'),
            r_ctx = Symbol('r_ctx'),
            args = [Symbol('arg1'),Symbol('arg2'),Symbol('arg3')],
            res = Symbol('res'),
            route = jest.fn(),
            action = jest.fn(errorFn),
            view = View(route);

        route.mockReturnValue(action);
        action.mockReturnValue(res);
        const r = await view(ctx,[r_ctx,...args]);

        expect(route).toHaveBeenCalledTimes(1);
        expect(route).toHaveBeenCalledWith(r_ctx);
        expect(action).toHaveBeenCalledTimes(1);
        expect(action).toHaveBeenCalledWith(ctx,...args);
        expect(r).toBe(res);
    });
});