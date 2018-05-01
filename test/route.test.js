const Route = require('../src/route');

const {koa} = Route,
    app = Symbol('app'),
    path = Symbol('path'),
    method = Symbol('method'),
    error = new Error(),
    errorFn = ()=>{throw error;};

describe('route',()=>{

    describe('koa',()=>{

        it('load undefined',async ()=>{
            const handle = jest.fn(),
                load = jest.fn(),
                next = jest.fn(),
                ctx = {path,method},
                mw = koa(load,handle);

            load.mockReturnValue(undefined);
            await mw(ctx,next);

            expect(load).toHaveBeenCalledTimes(1);
            expect(load).toHaveBeenCalledWith(path,method);
            expect(handle).toHaveBeenCalledTimes(0);
            expect(next).toHaveBeenCalledTimes(1);
        });

        it('handle undefined',async ()=>{
            const handle = jest.fn(),
                load = jest.fn(),
                next = jest.fn(),
                ctx = {path,method},
                mw = koa(load,handle);

            load.mockReturnValue(app);
            await mw(ctx,next);

            expect(load).toHaveBeenCalledTimes(1);
            expect(load).toHaveBeenCalledWith(path,method);
            expect(handle).toHaveBeenCalledTimes(1);
            expect(handle).toHaveBeenCalledWith(app);
            expect(next).toHaveBeenCalledTimes(1);
        });
        
        it('load undefined with next error',async ()=>{
            const handle = jest.fn(),
                load = jest.fn(),
                next = jest.fn(errorFn),
                ctx = {path,method},
                mw = koa(load,handle);

            let err;
            try{
                await mw(ctx,next);
            }catch (e){
                err = e;
            }
            
            expect(err).toBe(error);
            expect(load).toHaveBeenCalledTimes(1);
            expect(load).toHaveBeenCalledWith(path,method);
            expect(handle).toHaveBeenCalledTimes(0);
            expect(next).toHaveBeenCalledTimes(1);
        });
        
        it('handle undefined with next error',async ()=>{
            const handle = jest.fn(),
                load = jest.fn(),
                next = jest.fn(errorFn),
                ctx = {path,method},
                mw = koa(load,handle);

            load.mockReturnValue(app);
            let err;
            try{
                await mw(ctx,next);
            }catch (e){
                err = e;
            }
            
            expect(err).toBe(error);
            expect(load).toHaveBeenCalledTimes(1);
            expect(load).toHaveBeenCalledWith(path,method);
            expect(handle).toHaveBeenCalledTimes(1);
            expect(handle).toHaveBeenCalledWith(app);
            expect(next).toHaveBeenCalledTimes(1);
        });
        
        it('load error',async ()=>{
            const handle = jest.fn(),
                load = jest.fn(errorFn),
                next = jest.fn(),
                ctx = {path,method},
                mw = koa(load,handle);

            let err;
            try{
                await mw(ctx,next);
            }catch (e){
                err = e;
            }
            
            expect(err).toBe(error);
            expect(load).toHaveBeenCalledTimes(1);
            expect(load).toHaveBeenCalledWith(path,method);
            expect(handle).toHaveBeenCalledTimes(0);
            expect(next).toHaveBeenCalledTimes(0);
        });

        it('handle error',async ()=>{
            const handle = jest.fn(errorFn),
                load = jest.fn(),
                next = jest.fn(),
                ctx = {path,method},
                mw = koa(load,handle);
            
            load.mockReturnValue(app);
            let err;
            try{
                await mw(ctx,next);
            }catch (e){
                err = e;
            }
            
            expect(err).toBe(error);
            expect(load).toHaveBeenCalledTimes(1);
            expect(load).toHaveBeenCalledWith(path,method);
            expect(handle).toHaveBeenCalledTimes(1);
            expect(handle).toHaveBeenCalledWith(app);
            expect(next).toHaveBeenCalledTimes(0);
        });

        it('respond error',async ()=>{
            const handle = jest.fn(),
                load = jest.fn(),
                next = jest.fn(),
                respond = jest.fn(errorFn),
                ctx = {path,method},
                mw = koa(load,handle);

            load.mockReturnValue(app);
            handle.mockReturnValue(respond);
            let err;
            try{
                await mw(ctx,next);
            }catch (e){
                err = e;
            }
            
            expect(err).toBe(error);
            expect(load).toHaveBeenCalledTimes(1);
            expect(load).toHaveBeenCalledWith(path,method);
            expect(handle).toHaveBeenCalledTimes(1);
            expect(handle).toHaveBeenCalledWith(app);
            expect(respond).toHaveBeenCalledTimes(1);
            expect(respond).toHaveBeenCalledWith(ctx,next);
            expect(next).toHaveBeenCalledTimes(0);

        });

        it('complete',async ()=>{
            const handle = jest.fn(),
                load = jest.fn(),
                next = jest.fn(),
                respond = jest.fn(),
                ctx = {path,method},
                mw = koa(load,handle);

            load.mockReturnValue(app);
            handle.mockReturnValue(respond);
            await mw(ctx,next);
            
            expect(load).toHaveBeenCalledTimes(1);
            expect(load).toHaveBeenCalledWith(path,method);
            expect(handle).toHaveBeenCalledTimes(1);
            expect(handle).toHaveBeenCalledWith(app);
            expect(respond).toHaveBeenCalledTimes(1);
            expect(respond).toHaveBeenCalledWith(ctx,next);
            expect(next).toHaveBeenCalledTimes(0);
        });
    });

});