const Handle = require('../src/handle');
const {koa} = Handle,
    error = new Error(),
    errorFn = ()=>{throw error;};

describe('handle',()=>{
    
    describe('koa',()=>{
        
        it('wrong app',async ()=>{
            const context = jest.fn(),
                view = jest.fn(),
                app = Symbol(),
                module = koa(context,view),
                respond = await module(app);
            
            expect(context).toHaveBeenCalledTimes(0);
            expect(view).toHaveBeenCalledTimes(0);
            expect(respond).toBeUndefined();
        });

        it('context error',async ()=>{
            const context = jest.fn(errorFn),
                view = jest.fn(),
                app = jest.fn(),
                next = jest.fn(),
                ctx = Symbol('ctx'),
                module = koa(context,view),
                respond = await module(app);
                
            let err;
            try{
                await respond(ctx,next)
            }catch(e){
                err = e;
            }
                
            expect(err).toBe(error);
            expect(context).toHaveBeenCalledTimes(1);
            expect(context).toHaveBeenCalledWith(app,ctx);
            expect(app).toHaveBeenCalledTimes(0);
            expect(view).toHaveBeenCalledTimes(0);
            expect(next).toHaveBeenCalledTimes(0);
        });

        it('app error',async ()=>{
            const context = jest.fn(),
                view = jest.fn(),
                app = jest.fn(errorFn),
                next = jest.fn(),
                ctx = Symbol('ctx'),
                param = Symbol('param'),
                module = koa(context,view),
                respond = await module(app);
            
            context.mockReturnValue(param);
            let err;
            try{
                await respond(ctx,next)
            }catch(e){
                err = e;
            }
                
            expect(err).toBe(error);
            expect(context).toHaveBeenCalledTimes(1);
            expect(context).toHaveBeenCalledWith(app,ctx);
            expect(app).toHaveBeenCalledTimes(1);
            expect(app).toHaveBeenCalledWith(param);
            expect(view).toHaveBeenCalledTimes(0);
            expect(next).toHaveBeenCalledTimes(0);
        });

        it('view error',async ()=>{
            const context = jest.fn(),
                view = jest.fn(errorFn),
                app = jest.fn(),
                next = jest.fn(),
                ctx = Symbol('ctx'),
                param = Symbol('param'),
                result = Symbol('result'),
                module = koa(context,view),
                respond = await module(app);
            
            context.mockReturnValue(param);
            app.mockReturnValue(result);
            let err;
            try{
                await respond(ctx,next)
            }catch(e){
                err = e;
            }
                
            expect(err).toBe(error);
            expect(context).toHaveBeenCalledTimes(1);
            expect(context).toHaveBeenCalledWith(app,ctx);
            expect(app).toHaveBeenCalledTimes(1);
            expect(app).toHaveBeenCalledWith(param);
            expect(view).toHaveBeenCalledTimes(1);
            expect(view).toHaveBeenCalledWith(ctx,result);
            expect(next).toHaveBeenCalledTimes(0);
        });

        it('view not found',async ()=>{
            const context = jest.fn(),
                view = jest.fn(),
                view1 = jest.fn(),
                view2 = jest.fn(),
                app = jest.fn(),
                param = Symbol('param'),
                result = Symbol('result'),
                next = jest.fn(),
                ctx = Symbol('ctx'),
                module = koa(context,view,view1,view2);
            
            context.mockReturnValue(param);
            app.mockReturnValue(result);
            const respond = await module(app);
            let err;
            try{
                await respond(ctx,next)
            }catch(e){
                err = e;
            }

            expect(err).toBeDefined();
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
            const context = jest.fn(),
                view = jest.fn(),
                view1 = jest.fn(),
                view2 = jest.fn(),
                app = jest.fn(),
                param = Symbol('param'),
                result = Symbol('result'),
                next = jest.fn(),
                ctx = Symbol('ctx'),
                module = koa(context,view,view1,view2);
            
            context.mockReturnValue(param);
            app.mockReturnValue(result);
            view1.mockReturnValue(true);
            const respond = await module(app);
            await respond(ctx,next);
            
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
            const context = jest.fn(),
                view = jest.fn(),
                view1 = jest.fn(),
                view2 = jest.fn(),
                app = jest.fn(),
                param = Symbol('param'),
                result = Symbol('result'),
                next = jest.fn(),
                ctx = Symbol('ctx'),
                module = koa(context,view,view1,view2);
            
            context.mockReturnValue(param);
            app.mockReturnValue(result);
            view1.mockReturnValue(false);
            const respond = await module(app);
            await respond(ctx,next);
            
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
            const context = jest.fn(),
                view = jest.fn(),
                view1 = jest.fn(),
                view2 = jest.fn(),
                rsp = jest.fn(),
                app = jest.fn(),
                param = Symbol('param'),
                result = Symbol('result'),
                next = jest.fn(),
                ctx = Symbol('ctx'),
                module = koa(context,view,view1,view2);
            
            context.mockReturnValue(param);
            app.mockReturnValue(result);
            view1.mockReturnValue(rsp);
            const respond = await module(app);
            await respond(ctx,next);
            
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