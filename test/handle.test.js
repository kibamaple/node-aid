const Handle = require('../src/handle');
const {koa} = Handle,
    path = Symbol('path'),
    method = Symbol('method'),
    ctx = {path,method},
    error = new Error(),
    errorFn = ()=>{throw error;};

describe('handle',()=>{
    
    describe('koa',()=>{
        
        it('route undefined',async ()=>{
            const route = jest.fn(),
                context = jest.fn(),
                view = jest.fn(),
                next = jest.fn(),
                mw = koa(route,context,view);
                
            route.mockReturnValue(undefined);
            await mw(ctx,next);
            
            expect(route).toHaveBeenCalledTimes(1);
            expect(route).toHaveBeenCalledWith(path,method);
            expect(context).toHaveBeenCalledTimes(0);
            expect(view).toHaveBeenCalledTimes(0);
        });

        it('route error',async ()=>{
            const route = jest.fn(errorFn),
                context = jest.fn(),
                view = jest.fn(),
                next = jest.fn(),
                mw = koa(route,context,view);
            
            let err;
            try{
                await mw(ctx,next);
            }catch(e){
                err = e;
            }
            
            expect(err).toBe(error);
            expect(route).toHaveBeenCalledTimes(1);
            expect(route).toHaveBeenCalledWith(path,method);
            expect(context).toHaveBeenCalledTimes(0);
            expect(view).toHaveBeenCalledTimes(0);
        });

        it('context error',async ()=>{
            const route = jest.fn(),
                context = jest.fn(errorFn),
                view = jest.fn(),
                app = jest.fn(),
                next = jest.fn(),
                mw = koa(route,context,view);
                
            route.mockReturnValue(app);
            let err;
            try{
                await mw(ctx,next);
            }catch(e){
                err = e;
            }
                
            expect(err).toBe(error);
            expect(route).toHaveBeenCalledTimes(1);
            expect(route).toHaveBeenCalledWith(path,method);
            expect(context).toHaveBeenCalledTimes(1);
            expect(context).toHaveBeenCalledWith(app,ctx);
            expect(app).toHaveBeenCalledTimes(0);
            expect(view).toHaveBeenCalledTimes(0);
            expect(next).toHaveBeenCalledTimes(0);
        });

        it('app error',async ()=>{
            const route = jest.fn(), 
                context = jest.fn(),
                view = jest.fn(),
                app = jest.fn(errorFn),
                next = jest.fn(),
                param = Symbol('param'),
                mw = koa(route,context,view);
                
            
            route.mockReturnValue(app);
            context.mockReturnValue(param);
            let err;
            try{
                await mw(ctx,next);
            }catch(e){
                err = e;
            }
                
            expect(err).toBe(error);
            expect(route).toHaveBeenCalledTimes(1);
            expect(route).toHaveBeenCalledWith(path,method);
            expect(context).toHaveBeenCalledTimes(1);
            expect(context).toHaveBeenCalledWith(app,ctx);
            expect(app).toHaveBeenCalledTimes(1);
            expect(app).toHaveBeenCalledWith(param);
            expect(view).toHaveBeenCalledTimes(0);
            expect(next).toHaveBeenCalledTimes(0);
        });

        it('view error',async ()=>{
            const route = jest.fn(), 
                context = jest.fn(),
                view = jest.fn(errorFn),
                app = jest.fn(),
                next = jest.fn(),
                param = Symbol('param'),
                result = Symbol('result'),
                mw = koa(route,context,view);

            route.mockReturnValue(app);
            context.mockReturnValue(param);
            app.mockReturnValue(result);
            let err;
            try{
                await mw(ctx,next);
            }catch(e){
                err = e;
            }
                
            expect(err).toBe(error);
            expect(route).toHaveBeenCalledTimes(1);
            expect(route).toHaveBeenCalledWith(path,method);
            expect(context).toHaveBeenCalledTimes(1);
            expect(context).toHaveBeenCalledWith(app,ctx);
            expect(app).toHaveBeenCalledTimes(1);
            expect(app).toHaveBeenCalledWith(param);
            expect(view).toHaveBeenCalledTimes(1);
            expect(view).toHaveBeenCalledWith(ctx,result);
            expect(next).toHaveBeenCalledTimes(0);
        });

        it('view not found',async ()=>{
            const route = jest.fn(),
                context = jest.fn(),
                view = jest.fn(),
                view1 = jest.fn(),
                view2 = jest.fn(),
                app = jest.fn(),
                param = Symbol('param'),
                result = Symbol('result'),
                next = jest.fn(),
                mw = koa(route,context,view,view1,view2);
            
            route.mockReturnValue(app);
            context.mockReturnValue(param);
            app.mockReturnValue(result);
            let err;
            try{
                await mw(ctx,next);
            }catch(e){
                err = e;
            }

            expect(err).toBeDefined();
            expect(route).toHaveBeenCalledTimes(1);
            expect(route).toHaveBeenCalledWith(path,method);
            expect(context).toHaveBeenCalledTimes(1);
            expect(context).toHaveBeenCalledWith(app,ctx);
            expect(app).toHaveBeenCalledTimes(1);
            expect(app).toHaveBeenCalledWith(param);
            expect(view).toHaveBeenCalledTimes(1);
            expect(view).toHaveBeenCalledWith(ctx,result);
            expect(view1).toHaveBeenCalledTimes(1);
            expect(view1).toHaveBeenCalledWith(ctx,result);
            expect(view2).toHaveBeenCalledTimes(1);
            expect(next).toHaveBeenCalledTimes(0);
        });

        it('success',async ()=>{
            const route = jest.fn(),
                context = jest.fn(),
                view = jest.fn(),
                view1 = jest.fn(),
                view2 = jest.fn(),
                app = jest.fn(),
                param = Symbol('param'),
                result = Symbol('result'),
                next = jest.fn(),
                mw = koa(route,context,view,view1,view2);
            
            route.mockReturnValue(app);
            context.mockReturnValue(param);
            app.mockReturnValue(result);
            view1.mockReturnValue(true);
            await mw(ctx,next);
            
            expect(route).toHaveBeenCalledTimes(1);
            expect(route).toHaveBeenCalledWith(path,method);
            expect(context).toHaveBeenCalledTimes(1);
            expect(context).toHaveBeenCalledWith(app,ctx);
            expect(app).toHaveBeenCalledTimes(1);
            expect(app).toHaveBeenCalledWith(param);
            expect(view).toHaveBeenCalledTimes(1);
            expect(view).toHaveBeenCalledWith(ctx,result);
            expect(view1).toHaveBeenCalledTimes(1);
            expect(view1).toHaveBeenCalledWith(ctx,result);
            expect(view2).toHaveBeenCalledTimes(0);
            expect(next).toHaveBeenCalledTimes(0);
        });

        it('success with next',async ()=>{
            const route = jest.fn(),
                context = jest.fn(),
                view = jest.fn(),
                view1 = jest.fn(),
                view2 = jest.fn(),
                app = jest.fn(),
                param = Symbol('param'),
                result = Symbol('result'),
                next = jest.fn(),
                mw = koa(route,context,view,view1,view2);
            
            route.mockReturnValue(app);
            context.mockReturnValue(param);
            app.mockReturnValue(result);
            view1.mockReturnValue(false);
            await mw(ctx,next);
            
            expect(route).toHaveBeenCalledTimes(1);
            expect(route).toHaveBeenCalledWith(path,method);
            expect(context).toHaveBeenCalledTimes(1);
            expect(context).toHaveBeenCalledWith(app,ctx);
            expect(app).toHaveBeenCalledTimes(1);
            expect(app).toHaveBeenCalledWith(param);
            expect(view).toHaveBeenCalledTimes(1);
            expect(view).toHaveBeenCalledWith(ctx,result);
            expect(view1).toHaveBeenCalledTimes(1);
            expect(view1).toHaveBeenCalledWith(ctx,result);
            expect(view2).toHaveBeenCalledTimes(0);
            expect(next).toHaveBeenCalledTimes(1);
        });

        it('success with function',async ()=>{
            const route = jest.fn(),
                context = jest.fn(),
                view = jest.fn(),
                view1 = jest.fn(),
                view2 = jest.fn(),
                rsp = jest.fn(),
                app = jest.fn(),
                param = Symbol('param'),
                result = Symbol('result'),
                next = jest.fn(),
                mw = koa(route,context,view,view1,view2);
            
            route.mockReturnValue(app);
            context.mockReturnValue(param);
            app.mockReturnValue(result);
            view1.mockReturnValue(rsp);
            await mw(ctx,next);
            
            expect(route).toHaveBeenCalledTimes(1);
            expect(route).toHaveBeenCalledWith(path,method);
            expect(context).toHaveBeenCalledTimes(1);
            expect(context).toHaveBeenCalledWith(app,ctx);
            expect(app).toHaveBeenCalledTimes(1);
            expect(app).toHaveBeenCalledWith(param);
            expect(view).toHaveBeenCalledTimes(1);
            expect(view).toHaveBeenCalledWith(ctx,result);
            expect(view1).toHaveBeenCalledTimes(1);
            expect(view1).toHaveBeenCalledWith(ctx,result);
            expect(view2).toHaveBeenCalledTimes(0);
            expect(rsp).toHaveBeenCalledTimes(1);
            expect(rsp).toHaveBeenCalledWith(next);
        });

    });

});