const routes = [Symbol('route1'),Symbol('route2'),Symbol('route3')],
    views = [Symbol('view1'),Symbol('view2'),Symbol('view3')],
    view_routes = [Symbol('view_route1'),Symbol('view_route2'),Symbol('view_route3')],
    rs = [Symbol('rs1'),Symbol('rs2'),Symbol('rs3')],
    vs = [Symbol('vs1'),Symbol('vs2'),Symbol('vs3')],
    query = Symbol('query'),
    fields = Symbol('fields'),
    files = Symbol('files'),
    state = Symbol('state'),
    opts = {virtual: true},
    context= jest.fn(),
    handle= jest.fn(),
    route= jest.fn(),
    view= jest.fn(),
    error = new Error(),
    errorFn = ()=>{throw error;};

describe('koa',()=>{

    beforeAll(()=>{
        jest.doMock('../src/context',()=>context,opts);
        jest.doMock('../src/handle',()=>handle,opts);
        jest.doMock('../src/route',()=>route,opts);
        jest.doMock('../src/view',()=>view,opts);
    });

    afterEach(()=>{
        context.mockReset();
        handle.mockReset();
        route.mockReset();
        view.mockReset();
    });

    afterAll(()=>{
        jest.dontMock('../src/context');
        jest.dontMock('../src/handle');
        jest.dontMock('../src/route');
        jest.dontMock('../src/view');
        jest.resetModules();
    });

    it('route error',async ()=>{
        const next = jest.fn(),
            set = jest.fn(),
            cookie = jest.fn(),
            ctx = Symbol('ctx'),
            _ctx = {
                query,request:{fields,files},state,
                set,cookies:{set:cookie}
            },
            koa = require('../src/koa');
        
        for(let _rs of rs)
            route.mockImplementationOnce(errorFn);

        let err;
        try{
            await koa(routes,views);
        }catch(e){
            err = e;
        }

        expect(err).toBe(error);
        expect(route).toHaveBeenCalledTimes(1);
        expect(route.mock.calls[0][0]).toEqual(routes[0]);
        expect(view).not.toHaveBeenCalled();
        expect(handle).not.toHaveBeenCalled();
        expect(context).not.toHaveBeenCalled();
        expect(_ctx.status).toBeUndefined();
        expect(_ctx.body).toBeUndefined();
        expect(set).not.toHaveBeenCalled();
        expect(cookie).not.toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();
    });

    it('view route error',async ()=>{
        const next = jest.fn(),
            set = jest.fn(),
            cookie = jest.fn(),
            ctx = Symbol('ctx'),
            _ctx = {
                query,request:{fields,files},state,
                set,cookies:{set:cookie}
            },
            koa = require('../src/koa');
        
        for(let _rs of rs)
            route.mockReturnValueOnce(_rs);
        for(let _v_s of view_routes)
            route.mockImplementationOnce(errorFn);

        let err;
        try{
            await koa(routes,views);
        }catch(e){
            err = e;
        }

        expect(err).toBe(error);
        expect(route).toHaveBeenCalledTimes(rs.length+1);
        let i=0;
        for(let _r of routes)
            expect(route.mock.calls[i++][0]).toEqual(_r);
        expect(route.mock.calls[i][0]).toEqual(views[0]);

        expect(view).not.toHaveBeenCalled();
        expect(handle).not.toHaveBeenCalled();
        expect(context).not.toHaveBeenCalled();
        expect(_ctx.status).toBeUndefined();
        expect(_ctx.body).toBeUndefined();
        expect(set).not.toHaveBeenCalled();
        expect(cookie).not.toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();
    });

    it('view error',async ()=>{
        const next = jest.fn(),
            set = jest.fn(),
            cookie = jest.fn(),
            ctx = Symbol('ctx'),
            _ctx = {
                query,request:{fields,files},state,
                set,cookies:{set:cookie}
            },
            koa = require('../src/koa');
        
        for(let _rs of rs)
            route.mockReturnValueOnce(_rs);
        for(let _v_s of view_routes)
            route.mockReturnValueOnce(_v_s);
        for(let _vs of vs)
            view.mockImplementationOnce(errorFn);

        let err;
        try{
            await koa(routes,views);
        }catch(e){
            err = e;
        }

        expect(err).toBe(error);
        expect(route).toHaveBeenCalledTimes(rs.length + 1);
        let i=0;
        for(let _r of routes)
            expect(route.mock.calls[i++][0]).toEqual(_r);
        expect(route.mock.calls[i][0]).toEqual(views[0]);

        expect(view).toHaveBeenCalledTimes(1);
        expect(view.mock.calls[0][0]).toEqual(view_routes[0]);
        expect(handle).not.toHaveBeenCalled();
        expect(context).not.toHaveBeenCalled();
        expect(_ctx.status).toBeUndefined();
        expect(_ctx.body).toBeUndefined();
        expect(set).not.toHaveBeenCalled();
        expect(cookie).not.toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();
    });

    it('handle error',async ()=>{
        const next = jest.fn(),
            set = jest.fn(),
            cookie = jest.fn(),
            ctx = Symbol('ctx'),
            _ctx = {
                query,request:{fields,files},state,
                set,cookies:{set:cookie}
            },
            koa = require('../src/koa');
        
        for(let _rs of rs)
            route.mockReturnValueOnce(_rs);
        for(let _v_s of view_routes)
            route.mockReturnValueOnce(_v_s);
        for(let _vs of vs)
            view.mockReturnValueOnce(_vs);
        handle.mockImplementationOnce(errorFn);

        let err;
        try{
            await koa(routes,views);
        }catch(e){
            err = e;
        }

        expect(err).toBe(error);
        expect(route).toHaveBeenCalledTimes(rs.length + view_routes.length);
        let i=0;
        for(let _r of routes)
            expect(route.mock.calls[i++][0]).toEqual(_r);
        for(let _v of views)
            expect(route.mock.calls[i++][0]).toEqual(_v);

        expect(view).toHaveBeenCalledTimes(vs.length);
        i=0;
        for(let _vr of view_routes)
            expect(view.mock.calls[i++][0]).toEqual(_vr);
        
        expect(handle).toHaveBeenCalledTimes(1);
        expect(handle).toBeCalledWith(rs,vs);
        expect(context).not.toHaveBeenCalled();
        expect(_ctx.status).toBeUndefined();
        expect(_ctx.body).toBeUndefined();
        expect(set).not.toHaveBeenCalled();
        expect(cookie).not.toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();
    });

    it('context error',async ()=>{
        const next = jest.fn(),
            set = jest.fn(),
            cookie = jest.fn(),
            fn = jest.fn(),
            ctx = Symbol('ctx'),
            _ctx = {
                query,request:{fields,files},state,
                set,cookies:{set:cookie}
            },
            koa = require('../src/koa');
        
        for(let _rs of rs)
            route.mockReturnValueOnce(_rs);
        for(let _v_s of view_routes)
            route.mockReturnValueOnce(_v_s);
        for(let _vs of vs)
            view.mockReturnValueOnce(_vs);
        handle.mockReturnValueOnce(fn);
        context.mockImplementationOnce(errorFn);

        const mw = koa(routes,views);
        let err;
        try{
            await mw(_ctx,next);
        }catch(e){
            err = e;
        }

        expect(err).toBe(error);
        expect(route).toHaveBeenCalledTimes(rs.length + view_routes.length);
        let i=0;
        for(let _r of routes)
            expect(route.mock.calls[i++][0]).toEqual(_r);
        for(let _v of views)
            expect(route.mock.calls[i++][0]).toEqual(_v);

        expect(view).toHaveBeenCalledTimes(vs.length);
        i=0;
        for(let _vr of view_routes)
            expect(view.mock.calls[i++][0]).toEqual(_vr);
        
        expect(handle).toHaveBeenCalledTimes(1);
        expect(handle).toBeCalledWith(rs,vs);
        expect(context).toHaveBeenCalledTimes(1);
        expect(context).toBeCalledWith(undefined,state,files,fields,query);
        expect(fn).not.toHaveBeenCalled();
        expect(_ctx.status).toBeUndefined();
        expect(_ctx.body).toBeUndefined();
        expect(set).not.toHaveBeenCalled();
        expect(cookie).not.toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();
    });

    it('not found',async ()=>{
        const next = jest.fn(),
            set = jest.fn(),
            cookie = jest.fn(),
            ctx = Symbol('ctx'),
            _ctx = {
                query,request:{fields,files},state,
                set,cookies:{set:cookie}
            },
            fn = jest.fn(()=>{{throw _ctx;}}),
            koa = require('../src/koa');
        
        for(let _rs of rs)
            route.mockReturnValueOnce(_rs);
        for(let _v_s of view_routes)
            route.mockReturnValueOnce(_v_s);
        for(let _vs of vs)
            view.mockReturnValueOnce(_vs);
        handle.mockReturnValueOnce(fn);
        context.mockReturnValueOnce(ctx);

        const mw = koa(routes,views);
        await mw(_ctx,next);

        expect(route).toHaveBeenCalledTimes(rs.length + view_routes.length);
        let i=0;
        for(let _r of routes)
            expect(route.mock.calls[i++][0]).toEqual(_r);
        for(let _v of views)
            expect(route.mock.calls[i++][0]).toEqual(_v);

        expect(view).toHaveBeenCalledTimes(vs.length);
        i=0;
        for(let _vr of view_routes)
            expect(view.mock.calls[i++][0]).toEqual(_vr);
        
        expect(handle).toHaveBeenCalledTimes(1);
        expect(handle).toBeCalledWith(rs,vs);
        expect(context).toHaveBeenCalledTimes(1);
        expect(context).toBeCalledWith(undefined,state,files,fields,query);
        expect(fn).toHaveBeenCalledTimes(1);
        expect(fn).toBeCalledWith(_ctx,ctx);
        expect(_ctx.status).toBeUndefined();
        expect(_ctx.body).toBeUndefined();
        expect(set).not.toHaveBeenCalled();
        expect(cookie).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalledTimes(1);
    });

    it('process error',async ()=>{
        const next = jest.fn(),
            set = jest.fn(),
            cookie = jest.fn(),
            fn = jest.fn(errorFn),
            ctx = Symbol('ctx'),
            _ctx = {
                query,request:{fields,files},state,
                set,cookies:{set:cookie}
            },
            koa = require('../src/koa');
        
        for(let _rs of rs)
            route.mockReturnValueOnce(_rs);
        for(let _v_s of view_routes)
            route.mockReturnValueOnce(_v_s);
        for(let _vs of vs)
            view.mockReturnValueOnce(_vs);
        handle.mockReturnValueOnce(fn);
        context.mockReturnValueOnce(ctx);

        const mw = koa(routes,views);
        let err;
        try{
            await mw(_ctx,next);
        }catch(e){
            err = e;
        }

        expect(err).toBe(error);
        expect(route).toHaveBeenCalledTimes(rs.length + view_routes.length);
        let i=0;
        for(let _r of routes)
            expect(route.mock.calls[i++][0]).toEqual(_r);
        for(let _v of views)
            expect(route.mock.calls[i++][0]).toEqual(_v);

        expect(view).toHaveBeenCalledTimes(vs.length);
        i=0;
        for(let _vr of view_routes)
            expect(view.mock.calls[i++][0]).toEqual(_vr);
        
        expect(handle).toHaveBeenCalledTimes(1);
        expect(handle).toBeCalledWith(rs,vs);
        expect(context).toHaveBeenCalledTimes(1);
        expect(context).toBeCalledWith(undefined,state,files,fields,query);
        expect(fn).toHaveBeenCalledTimes(1);
        expect(fn).toBeCalledWith(_ctx,ctx);
        expect(_ctx.status).toBeUndefined();
        expect(_ctx.body).toBeUndefined();
        expect(set).not.toHaveBeenCalled();
        expect(cookie).not.toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();
    });

    it('next',async ()=>{
        const next = jest.fn(),
            set = jest.fn(),
            cookie = jest.fn(),
            fn = jest.fn(),
            ctx = Symbol('ctx'),
            _ctx = {
                query,request:{fields,files},state,
                set,cookies:{set:cookie}
            },
            koa = require('../src/koa');
        
        for(let _rs of rs)
            route.mockReturnValueOnce(_rs);
        for(let _v_s of view_routes)
            route.mockReturnValueOnce(_v_s);
        for(let _vs of vs)
            view.mockReturnValueOnce(_vs);
        handle.mockReturnValueOnce(fn);
        context.mockReturnValueOnce(ctx);

        const mw = koa(routes,views);
        await mw(_ctx,next);

        expect(route).toHaveBeenCalledTimes(rs.length + view_routes.length);
        let i=0;
        for(let _r of routes)
            expect(route.mock.calls[i++][0]).toEqual(_r);
        for(let _v of views)
            expect(route.mock.calls[i++][0]).toEqual(_v);

        expect(view).toHaveBeenCalledTimes(vs.length);
        i=0;
        for(let _vr of view_routes)
            expect(view.mock.calls[i++][0]).toEqual(_vr);
        
        expect(handle).toHaveBeenCalledTimes(1);
        expect(handle).toBeCalledWith(rs,vs);
        expect(context).toHaveBeenCalledTimes(1);
        expect(context).toBeCalledWith(undefined,state,files,fields,query);
        expect(fn).toHaveBeenCalledTimes(1);
        expect(fn).toBeCalledWith(_ctx,ctx);
        expect(_ctx.status).toBeUndefined();
        expect(_ctx.body).toBeUndefined();
        expect(set).not.toHaveBeenCalled();
        expect(cookie).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalledTimes(1);
    });

    it('respond null',async ()=>{
        const next = jest.fn(),
            set = jest.fn(),
            cookie = jest.fn(),
            fn = jest.fn(),
            ctx = Symbol('ctx'),
            _ctx = {
                query,request:{fields,files},state,
                set,cookies:{set:cookie}
            },
            koa = require('../src/koa');
        
        for(let _rs of rs)
            route.mockReturnValueOnce(_rs);
        for(let _v_s of view_routes)
            route.mockReturnValueOnce(_v_s);
        for(let _vs of vs)
            view.mockReturnValueOnce(_vs);
        handle.mockReturnValueOnce(fn);
        context.mockReturnValueOnce(ctx);
        fn.mockReturnValueOnce(null);

        const mw = koa(routes,views);
        await mw(_ctx,next);

        expect(route).toHaveBeenCalledTimes(rs.length + view_routes.length);
        let i=0;
        for(let _r of routes)
            expect(route.mock.calls[i++][0]).toEqual(_r);
        for(let _v of views)
            expect(route.mock.calls[i++][0]).toEqual(_v);

        expect(view).toHaveBeenCalledTimes(vs.length);
        i=0;
        for(let _vr of view_routes)
            expect(view.mock.calls[i++][0]).toEqual(_vr);
        
        expect(handle).toHaveBeenCalledTimes(1);
        expect(handle).toBeCalledWith(rs,vs);
        expect(context).toHaveBeenCalledTimes(1);
        expect(context).toBeCalledWith(undefined,state,files,fields,query);
        expect(fn).toHaveBeenCalledTimes(1);
        expect(fn).toBeCalledWith(_ctx,ctx);
        expect(_ctx.status).toBe(200);
        expect(_ctx.body).toBeUndefined();
        expect(set).not.toHaveBeenCalled();
        expect(cookie).not.toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();
    });

    it('respond array',async ()=>{
        const next = jest.fn(),
            set = jest.fn(),
            cookie = jest.fn(),
            fn = jest.fn(),
            ctx = Symbol('ctx'),
            status = 200,
            body = Symbol('body'),
            headers = {
                h1:Symbol('h1'),h2:Symbol('h2'),h3:Symbol('h3')
            },
            cookies = [[Symbol('c1'),Symbol('c2'),Symbol('c3')]],
            _ctx = {
                query,request:{fields,files},state,
                set,cookies:{set:cookie}
            },
            koa = require('../src/koa');
        
        for(let _rs of rs)
            route.mockReturnValueOnce(_rs);
        for(let _v_s of view_routes)
            route.mockReturnValueOnce(_v_s);
        for(let _vs of vs)
            view.mockReturnValueOnce(_vs);
        handle.mockReturnValueOnce(fn);
        context.mockReturnValueOnce(ctx);
        fn.mockReturnValueOnce([status,body,headers,cookies]);

        const mw = koa(routes,views);
        await mw(_ctx,next);

        expect(route).toHaveBeenCalledTimes(rs.length + view_routes.length);
        let i=0;
        for(let _r of routes)
            expect(route.mock.calls[i++][0]).toEqual(_r);
        for(let _v of views)
            expect(route.mock.calls[i++][0]).toEqual(_v);

        expect(view).toHaveBeenCalledTimes(vs.length);
        i=0;
        for(let _vr of view_routes)
            expect(view.mock.calls[i++][0]).toEqual(_vr);
        
        expect(handle).toHaveBeenCalledTimes(1);
        expect(handle).toBeCalledWith(rs,vs);
        expect(context).toHaveBeenCalledTimes(1);
        expect(context).toBeCalledWith(undefined,state,files,fields,query);
        expect(fn).toHaveBeenCalledTimes(1);
        expect(fn).toBeCalledWith(_ctx,ctx);
        expect(_ctx.status).toBe(status);
        expect(_ctx.body).toBe(body);
        expect(set).toHaveBeenCalledTimes(1);
        expect(set).toHaveBeenCalledWith(headers);
        expect(cookie).toHaveBeenCalledTimes(cookies.length);
        expect(cookie.mock.calls).toEqual(cookies);
        expect(next).not.toHaveBeenCalled();
    });

    it('respond object',async ()=>{
        const next = jest.fn(),
            set = jest.fn(),
            cookie = jest.fn(),
            fn = jest.fn(),
            ctx = Symbol('ctx'),
            status = 200,
            body = Symbol('body'),
            headers = {
                h1:Symbol('h1'),h2:Symbol('h2'),h3:Symbol('h3')
            },
            cookies = [[Symbol('c1'),Symbol('c2'),Symbol('c3')]],
            _ctx = {
                query,request:{fields,files},state,
                set,cookies:{set:cookie}
            },
            koa = require('../src/koa');
        
        for(let _rs of rs)
            route.mockReturnValueOnce(_rs);
        for(let _v_s of view_routes)
            route.mockReturnValueOnce(_v_s);
        for(let _vs of vs)
            view.mockReturnValueOnce(_vs);
        handle.mockReturnValueOnce(fn);
        context.mockReturnValueOnce(ctx);
        fn.mockReturnValueOnce({
            status,body,headers,cookies
        });

        const mw = koa(routes,views);
        await mw(_ctx,next);

        expect(route).toHaveBeenCalledTimes(rs.length + view_routes.length);
        let i=0;
        for(let _r of routes)
            expect(route.mock.calls[i++][0]).toEqual(_r);
        for(let _v of views)
            expect(route.mock.calls[i++][0]).toEqual(_v);

        expect(view).toHaveBeenCalledTimes(vs.length);
        i=0;
        for(let _vr of view_routes)
            expect(view.mock.calls[i++][0]).toEqual(_vr);
        
        expect(handle).toHaveBeenCalledTimes(1);
        expect(handle).toBeCalledWith(rs,vs);
        expect(context).toHaveBeenCalledTimes(1);
        expect(context).toBeCalledWith(undefined,state,files,fields,query);
        expect(fn).toHaveBeenCalledTimes(1);
        expect(fn).toBeCalledWith(_ctx,ctx);
        expect(_ctx.status).toBe(status);
        expect(_ctx.body).toBe(body);
        expect(set).toHaveBeenCalledTimes(1);
        expect(set).toHaveBeenCalledWith(headers);
        expect(cookie).toHaveBeenCalledTimes(cookies.length);
        expect(cookie.mock.calls).toEqual(cookies);
        expect(next).not.toHaveBeenCalled();
    });
});
