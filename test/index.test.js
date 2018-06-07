const opts = {virtual: true},
    context= Symbol('context'),
    handle = Symbol('handle'),
    is = Symbol('is'),
    route = Symbol('route'),
    table = Symbol('table'),
    koa = Symbol('koa'),
    view = Symbol('view');

describe('index',()=>{

    beforeAll(()=>{
        jest.doMock('@/context',()=>context,opts);
        jest.doMock('@/handle',()=>handle,opts);
        jest.doMock('@/is',()=>is,opts);
        jest.doMock('@/route',()=>route,opts);
        jest.doMock('@/table',()=>table,opts);
        jest.doMock('@/koa',()=>koa,opts);
        jest.doMock('@/view',()=>view,opts);
    })

    afterAll(()=>{
        jest.dontMock('@/context');
        jest.dontMock('@/handle');
        jest.dontMock('@/is');
        jest.dontMock('@/route');
        jest.dontMock('@/table');
        jest.dontMock('@/koa');
        jest.dontMock('@/view');
        jest.resetModules();
    });

    it('exports',()=>{
        const module = require('@/index'),
            {Context,Handle,Is,Route,Table,View,Koa} = module;
        
        expect(Context).toBe(context);
        expect(Handle).toBe(handle);
        expect(Is).toBe(is);
        expect(Route).toBe(route);
        expect(Table).toBe(table);
        expect(View).toBe(view);
        expect(Koa).toBe(koa);
    });

});
