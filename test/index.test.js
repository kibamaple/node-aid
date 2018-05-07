const context = Symbol('context'),
    handle = jest.fn(),
    route = jest.fn(),
    view = jest.fn(),
    opts = {virtual: true};

jest.doMock('../src/context',()=>({koa:context}),opts);
jest.doMock('../src/handle',()=>({koa:handle}),opts);
jest.doMock('../src/route',()=>({search:route}),opts);
jest.doMock('../src/view',()=>({koa:view}),opts);
const Index = require('../src/index');
jest.dontMock('../src/context');
jest.dontMock('../src/handle');
jest.dontMock('../src/route');
jest.dontMock('../src/view');
jest.resetModules();

const {koa} = Index,
    ctrl = Symbol('ctrl'),
    views = [Symbol('view1'),Symbol('view2'),Symbol('view3')],
    error = new Error(),
    errorFn = ()=>{throw error;};

describe('index',()=>{
    
    describe('koa',()=>{
        
        afterEach(()=>{
            handle.mockReset();
            route.mockReset();
            view.mockReset();
        });

        it('route error',()=>{
            route.mockImplementation(errorFn);
            let err;
            try{
                koa(ctrl,...views);
            }catch(e){
                err = e;
            }
            expect(err).toBe(error);
            expect(route).toHaveBeenCalledTimes(1);
            expect(route).toHaveBeenCalledWith(ctrl);
            expect(handle).toHaveBeenCalledTimes(0);
            expect(view).toHaveBeenCalledTimes(0);
        });

        it('default view error',()=>{
            const r = Symbol('r');

            route.mockReturnValue(r);
            view.mockImplementation(errorFn);
            let err;
            try{
                koa(ctrl,...views);
            }catch(e){
                err = e;
            }
            expect(err).toBe(error);
            expect(route).toHaveBeenCalledTimes(1);
            expect(route).toHaveBeenCalledWith(ctrl);
            expect(view).toHaveBeenCalledTimes(1);
            expect(view).toHaveBeenCalledWith(true);
            expect(handle).toHaveBeenCalledTimes(0);
        });

        it('handle error',()=>{
            const r = Symbol('r'),
                v = Symbol('v');

            route.mockReturnValue(r);
            view.mockReturnValue(v);
            handle.mockImplementation(errorFn);
            let err;
            try{
                koa(ctrl,...views);
            }catch(e){
                err = e;
            }
            expect(err).toBe(error);
            expect(route).toHaveBeenCalledTimes(1);
            expect(route).toHaveBeenCalledWith(ctrl);
            expect(view).toHaveBeenCalledTimes(1);
            expect(view).toHaveBeenCalledWith(true);
            expect(handle).toHaveBeenCalledTimes(1);
            expect(handle).toHaveBeenCalledWith(r,context,...views,v);
        });
        
        it('success',()=>{
            const r = Symbol('r'),
                v = Symbol('v'),
                res = Symbol('res');

            route.mockReturnValue(r);
            view.mockReturnValue(v);
            handle.mockReturnValue(res);
            const respd = koa(ctrl,...views);
            expect(respd).toBe(res);
            expect(route).toHaveBeenCalledTimes(1);
            expect(route).toHaveBeenCalledWith(ctrl);
            expect(view).toHaveBeenCalledTimes(1);
            expect(view).toHaveBeenCalledWith(true);
            expect(handle).toHaveBeenCalledTimes(1);
            expect(handle).toHaveBeenCalledWith(r,context,...views,v);
        });
    });

});
