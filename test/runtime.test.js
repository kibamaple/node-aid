const Runtime = require('../src/runtime');
const {koa} = Runtime,
    app = Symbol('app'),
    path = Symbol('path'),
    method = Symbol('method'),
    error = new Error(),
    errorFn = ()=>{throw error;};

describe('runtime',()=>{

    describe('koa',()=>{

        it('route undefined',async ()=>{
            const handle = jest.fn(),
                route = jest.fn(),
                next = jest.fn(),
                ctx = {path,method},
                mw = koa(route,handle);

            route.mockReturnValue(undefined);
            await mw(ctx,next);

            expect(route).toHaveBeenCalledTimes(1);
            expect(route).toHaveBeenCalledWith(path,method);
            expect(handle).toHaveBeenCalledTimes(0);
            expect(next).toHaveBeenCalledTimes(1);
        });

        it('handle undefined',async ()=>{
            const handle = jest.fn(),
                route = jest.fn(),
                next = jest.fn(),
                ctx = {path,method},
                mw = koa(route,handle);

            route.mockReturnValue(app);
            await mw(ctx,next);

            expect(route).toHaveBeenCalledTimes(1);
            expect(route).toHaveBeenCalledWith(path,method);
            expect(handle).toHaveBeenCalledTimes(1);
            expect(handle).toHaveBeenCalledWith(app);
            expect(next).toHaveBeenCalledTimes(1);
        });
        
        it('route undefined with next error',async ()=>{
            const handle = jest.fn(),
                route = jest.fn(),
                next = jest.fn(errorFn),
                ctx = {path,method},
                mw = koa(route,handle);

            let err;
            try{
                await mw(ctx,next);
            }catch (e){
                err = e;
            }
            
            expect(err).toBe(error);
            expect(route).toHaveBeenCalledTimes(1);
            expect(route).toHaveBeenCalledWith(path,method);
            expect(handle).toHaveBeenCalledTimes(0);
            expect(next).toHaveBeenCalledTimes(1);
        });
        
        it('handle undefined with next error',async ()=>{
            const handle = jest.fn(),
                route = jest.fn(),
                next = jest.fn(errorFn),
                ctx = {path,method},
                mw = koa(route,handle);

            route.mockReturnValue(app);
            let err;
            try{
                await mw(ctx,next);
            }catch (e){
                err = e;
            }
            
            expect(err).toBe(error);
            expect(route).toHaveBeenCalledTimes(1);
            expect(route).toHaveBeenCalledWith(path,method);
            expect(handle).toHaveBeenCalledTimes(1);
            expect(handle).toHaveBeenCalledWith(app);
            expect(next).toHaveBeenCalledTimes(1);
        });
        
        it('route error',async ()=>{
            const handle = jest.fn(),
                route = jest.fn(errorFn),
                next = jest.fn(),
                ctx = {path,method},
                mw = koa(route,handle);

            let err;
            try{
                await mw(ctx,next);
            }catch (e){
                err = e;
            }
            
            expect(err).toBe(error);
            expect(route).toHaveBeenCalledTimes(1);
            expect(route).toHaveBeenCalledWith(path,method);
            expect(handle).toHaveBeenCalledTimes(0);
            expect(next).toHaveBeenCalledTimes(0);
        });

        it('handle error',async ()=>{
            const handle = jest.fn(errorFn),
                route = jest.fn(),
                next = jest.fn(),
                ctx = {path,method},
                mw = koa(route,handle);
            
            route.mockReturnValue(app);
            let err;
            try{
                await mw(ctx,next);
            }catch (e){
                err = e;
            }
            
            expect(err).toBe(error);
            expect(route).toHaveBeenCalledTimes(1);
            expect(route).toHaveBeenCalledWith(path,method);
            expect(handle).toHaveBeenCalledTimes(1);
            expect(handle).toHaveBeenCalledWith(app);
            expect(next).toHaveBeenCalledTimes(0);
        });

        it('respond error',async ()=>{
            const handle = jest.fn(),
                route = jest.fn(),
                next = jest.fn(),
                respond = jest.fn(errorFn),
                ctx = {path,method},
                mw = koa(route,handle);

            route.mockReturnValue(app);
            handle.mockReturnValue(respond);
            let err;
            try{
                await mw(ctx,next);
            }catch (e){
                err = e;
            }
            
            expect(err).toBe(error);
            expect(route).toHaveBeenCalledTimes(1);
            expect(route).toHaveBeenCalledWith(path,method);
            expect(handle).toHaveBeenCalledTimes(1);
            expect(handle).toHaveBeenCalledWith(app);
            expect(respond).toHaveBeenCalledTimes(1);
            expect(respond).toHaveBeenCalledWith(ctx,next);
            expect(next).toHaveBeenCalledTimes(0);

        });

        it('complete',async ()=>{
            const handle = jest.fn(),
                route = jest.fn(),
                next = jest.fn(),
                respond = jest.fn(),
                ctx = {path,method},
                mw = koa(route,handle);

            route.mockReturnValue(app);
            handle.mockReturnValue(respond);
            await mw(ctx,next);
            
            expect(route).toHaveBeenCalledTimes(1);
            expect(route).toHaveBeenCalledWith(path,method);
            expect(handle).toHaveBeenCalledTimes(1);
            expect(handle).toHaveBeenCalledWith(app);
            expect(respond).toHaveBeenCalledTimes(1);
            expect(respond).toHaveBeenCalledWith(ctx,next);
            expect(next).toHaveBeenCalledTimes(0);
        });
    });

});