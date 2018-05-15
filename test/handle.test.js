const Handle = require('../src/handle');

const path = Symbol('path'),
    ctx = Symbol('ctx'),
    res = Symbol('res'),
    respond = Symbol('respond'),
    error = new Error(),
    errorFn = ()=>{throw error;};

describe('handle',()=>{

    it('route error',async ()=>{
        const route = jest.fn(errorFn),
            view = jest.fn(),
            f_route = jest.fn(),
            f_view = jest.fn(),
            l_route = jest.fn(),
            l_view = jest.fn(),
            handle = Handle(
                [f_route,route,l_route],
                [f_view,view,l_view]
            );

        let err;
        try{
            await handle(path,ctx);
        }catch(e){
            err = e;
        }

        expect(err).toBe(error);
        expect(f_route).toHaveBeenCalledTimes(1);
        expect(f_route).toHaveBeenCalledWith(path);
        expect(route).toHaveBeenCalledTimes(1);
        expect(route).toHaveBeenCalledWith(path);
        expect(l_route).not.toHaveBeenCalled();
        expect(f_view).not.toHaveBeenCalled();
        expect(view).not.toHaveBeenCalled();
        expect(l_view).not.toHaveBeenCalled();        
    });

    it('non route match',async ()=>{
        const route = jest.fn(),
            view = jest.fn(),
            f_route = jest.fn(),
            f_view = jest.fn(),
            l_route = jest.fn(),
            l_view = jest.fn(),
            handle = Handle(
                [f_route,route,l_route],
                [f_view,view,l_view]
            );

        let err;
        try{
            await handle(path,ctx);
        }catch(e){
            err = e;
        }

        expect(err).toBe(path);
        expect(f_route).toHaveBeenCalledTimes(1);
        expect(f_route).toHaveBeenCalledWith(path);
        expect(route).toHaveBeenCalledTimes(1);
        expect(route).toHaveBeenCalledWith(path);
        expect(l_route).toHaveBeenCalledTimes(1);
        expect(l_route).toHaveBeenCalledWith(path);
        expect(f_view).not.toHaveBeenCalled();
        expect(view).not.toHaveBeenCalled();
        expect(l_view).not.toHaveBeenCalled();
    });

    it('action error',async ()=>{
        const route = jest.fn(),
            view = jest.fn(),
            f_route = jest.fn(),
            f_view = jest.fn(),
            l_route = jest.fn(),
            l_view = jest.fn(),
            action = jest.fn(errorFn),
            handle = Handle(
                [f_route,route,l_route],
                [f_view,view,l_view]
            );
        
        route.mockReturnValue(action);
        let err;
        try{
            await handle(path,ctx);
        }catch(e){
            err = e;
        }

        expect(err).toBe(error);
        expect(f_route).toHaveBeenCalledTimes(1);
        expect(f_route).toHaveBeenCalledWith(path);
        expect(route).toHaveBeenCalledTimes(1);
        expect(route).toHaveBeenCalledWith(path);
        expect(l_route).not.toHaveBeenCalled();
        expect(action).toHaveBeenCalledTimes(1);
        expect(action).toHaveBeenCalledWith(ctx);
        expect(f_view).not.toHaveBeenCalled();
        expect(view).not.toHaveBeenCalled();
        expect(l_view).not.toHaveBeenCalled();
    });

    it('view error',async ()=>{
        const route = jest.fn(),
            view = jest.fn(errorFn),
            f_route = jest.fn(),
            f_view = jest.fn(),
            l_route = jest.fn(),
            l_view = jest.fn(),
            action = jest.fn(),
            handle = Handle(
                [f_route,route,l_route],
                [f_view,view,l_view]
            );
        
        route.mockReturnValue(action);
        action.mockReturnValue(res);
        let err;
        try{
            await handle(path,ctx);
        }catch(e){
            err = e;
        }

        expect(err).toBe(error);
        expect(f_route).toHaveBeenCalledTimes(1);
        expect(f_route).toHaveBeenCalledWith(path);
        expect(route).toHaveBeenCalledTimes(1);
        expect(route).toHaveBeenCalledWith(path);
        expect(l_route).not.toHaveBeenCalled();
        expect(action).toHaveBeenCalledTimes(1);
        expect(action).toHaveBeenCalledWith(ctx);
        expect(f_view).toHaveBeenCalledTimes(1);
        expect(f_view).toHaveBeenCalledWith(ctx,res);
        expect(view).toHaveBeenCalledTimes(1);
        expect(view).toHaveBeenCalledWith(ctx,res);
        expect(l_view).not.toHaveBeenCalled();
    });

    it('non view match',async ()=>{
        const route = jest.fn(),
            view = jest.fn(),
            f_route = jest.fn(),
            f_view = jest.fn(),
            l_route = jest.fn(),
            l_view = jest.fn(),
            action = jest.fn(),
            handle = Handle(
                [f_route,route,l_route],
                [f_view,view,l_view]
            );
        
        route.mockReturnValue(action);
        action.mockReturnValue(res);
        const rsd = await handle(path,ctx);

        expect(f_route).toHaveBeenCalledTimes(1);
        expect(f_route).toHaveBeenCalledWith(path);
        expect(route).toHaveBeenCalledTimes(1);
        expect(route).toHaveBeenCalledWith(path);
        expect(l_route).not.toHaveBeenCalled();
        expect(action).toHaveBeenCalledTimes(1);
        expect(action).toHaveBeenCalledWith(ctx);
        expect(f_view).toHaveBeenCalledTimes(1);
        expect(f_view).toHaveBeenCalledWith(ctx,res);
        expect(view).toHaveBeenCalledTimes(1);
        expect(view).toHaveBeenCalledWith(ctx,res);
        expect(l_view).toHaveBeenCalledTimes(1);
        expect(l_view).toHaveBeenCalledWith(ctx,res);
        expect(rsd).toBeUndefined();
    });

    it('complete',async ()=>{
        const route = jest.fn(),
            view = jest.fn(),
            f_route = jest.fn(),
            f_view = jest.fn(),
            l_route = jest.fn(),
            l_view = jest.fn(),
            action = jest.fn(),
            handle = Handle(
                [f_route,route,l_route],
                [f_view,view,l_view]
            );
        
        route.mockReturnValue(action);
        action.mockReturnValue(res);
        view.mockReturnValue(respond);
        const rsd = await handle(path,ctx);

        expect(f_route).toHaveBeenCalledTimes(1);
        expect(f_route).toHaveBeenCalledWith(path);
        expect(route).toHaveBeenCalledTimes(1);
        expect(route).toHaveBeenCalledWith(path);
        expect(l_route).not.toHaveBeenCalled();
        expect(action).toHaveBeenCalledTimes(1);
        expect(action).toHaveBeenCalledWith(ctx);
        expect(f_view).toHaveBeenCalledTimes(1);
        expect(f_view).toHaveBeenCalledWith(ctx,res);
        expect(view).toHaveBeenCalledTimes(1);
        expect(view).toHaveBeenCalledWith(ctx,res);
        expect(l_view).not.toHaveBeenCalled();
        expect(rsd).toBe(respond);
    });
});