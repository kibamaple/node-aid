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
        jest.doMock('../src/context',()=>context,opts);
        jest.doMock('../src/handle',()=>handle,opts);
        jest.doMock('../src/is',()=>is,opts);
        jest.doMock('../src/route',()=>route,opts);
        jest.doMock('../src/table',()=>table,opts);
        jest.doMock('../src/koa',()=>koa,opts);
        jest.doMock('../src/view',()=>view,opts);
    })

    afterAll(()=>{
        jest.dontMock('../src/context');
        jest.dontMock('../src/handle');
        jest.dontMock('../src/is');
        jest.dontMock('../src/route');
        jest.dontMock('../src/table');
        jest.dontMock('../src/koa');
        jest.dontMock('../src/view');
        jest.resetModules();
    });

    it('exports',()=>{
        const module = require('../src/index'),
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
