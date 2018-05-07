const traverse = jest.fn(),
    opts = {virtual: true};

jest.doMock('../src/js',()=>({traverse}),opts);
const Route = require('../src/route');
jest.dontMock('../src/js');
jest.resetModules();

const {search} = Route,
    current = '.',
    root = __dirname,
    method = 'METHOD',
    name = 'name',
    slash = '/',
    s_name = slash+name,
    c_name = current + s_name,
    f_name = name+'.js',
    error = new Error(),
    errorFn = ()=>{throw error;};

describe('route',()=>{
    
    describe('search',()=>{

        afterEach(()=>{
            traverse.mockReset();
            jest.resetModules();
        });

        it('not found module with empty',async ()=>{
            traverse.mockResolvedValue([]);
            const route = search(root),
                app = await route(name,method),
                app1 = await route(s_name,method);

            expect(traverse).toHaveBeenCalledTimes(1);
            expect(traverse).toHaveBeenCalledWith(root);
            expect(app).toBeUndefined();
            expect(app1).toBeUndefined();
        });

        it('not found module',async ()=>{
            traverse.mockResolvedValue(['index.js']);
            const route = search(root),
                app = await route(name,method),
                app1 = await route(s_name,method);

            expect(traverse).toHaveBeenCalledTimes(1);
            expect(traverse).toHaveBeenCalledWith(root);
            expect(app).toBeUndefined();
            expect(app1).toBeUndefined();
        });

        it('not found method',async ()=>{
            const fy = jest.fn();

            traverse.mockResolvedValue([f_name]);
            const route = search(root);
            
            jest.doMock(c_name,()=>({}),opts);
            const app = await route(name,method);
            jest.dontMock(c_name);
            jest.resetModules();

            jest.doMock(c_name,()=>fy,opts);
            const app1 = await route(s_name,method);
            jest.dontMock(c_name);

            expect(traverse).toHaveBeenCalledTimes(1);
            expect(traverse).toHaveBeenCalledWith(root);
            expect(fy).toHaveBeenCalledTimes(1);
            expect(fy).toHaveBeenCalledWith(method.toLowerCase());
            expect(app).toBeUndefined();
            expect(app1).toBeUndefined();
        });

        it('error traverse',async ()=>{
            traverse.mockRejectedValue(error);
            let err;
            const route = search(root);
            try{
                await route(name,method);
            }catch(e){
                err = e;
            }
            expect(err).toBe(error);

            try{
                await route(s_name,method);
            }catch(e){
                err = e;
            }   
            expect(err).toBe(error);

            expect(traverse).toHaveBeenCalledTimes(1);
            expect(traverse).toHaveBeenCalledWith(root);
        });

        it('error module',async ()=>{
            traverse.mockResolvedValue([f_name]);
            jest.doMock(c_name,()=>errorFn,opts);
            let err;
            const route = search(root);
            try{
                await route(name,method);
            }catch(e){
                err = e;
            }
            expect(err).toBe(error);

            try{
                await route(s_name,method);
            }catch(e){
                err = e;
            }   
            expect(err).toBe(error);
            jest.dontMock(c_name);
            
            expect(traverse).toHaveBeenCalledTimes(1);
            expect(traverse).toHaveBeenCalledWith(root);
        });
        
        it('error method',async ()=>{
            const fy = jest.fn(errorFn);
            
            traverse.mockResolvedValue([f_name]);
            let err;
            const route = search(root);
            
            jest.doMock(c_name,()=>fy,opts);
            try{
                await route(name,method);
            }catch(e){
                err = e;
            }
            expect(err).toBe(error);
            jest.dontMock(c_name);
            
            expect(traverse).toHaveBeenCalledTimes(1);
            expect(traverse).toHaveBeenCalledWith(root);
            expect(fy).toHaveBeenCalledTimes(1);
            expect(fy).toHaveBeenCalledWith(method.toLowerCase());
        });
        
        it('success',async ()=>{
            const fy = jest.fn(),
                result1 = Symbol('result1'),
                result2 = Symbol('result2');
            traverse.mockResolvedValue([f_name,name+slash+f_name]);
            fy.mockReturnValue(result2)

            jest.doMock(c_name,()=>({method:result1}),opts);
            jest.doMock(c_name+slash+name,()=>fy,opts);
            const route = search(root),
                app1 = await route(s_name,method),
                app2 = await route(name+slash+name,method);
            jest.dontMock(c_name);
            jest.dontMock(c_name+slash+name);
            
            expect(traverse).toHaveBeenCalledTimes(1);
            expect(traverse).toHaveBeenCalledWith(root);
            expect(fy).toHaveBeenCalledTimes(1);
            expect(fy).toHaveBeenCalledWith(method.toLowerCase());
            expect(app1).toBe(result1);
            expect(app2).toBe(result2);
        });

        it('success index',async ()=>{
            const fy = jest.fn(),
                result1 = Symbol('result1'),
                result2 = Symbol('result2');
            traverse.mockResolvedValue(['index.js',name+slash+'index.js']);
            fy.mockReturnValue(result2)

            jest.doMock('./index',()=>({method:result1}),opts);
            jest.doMock(c_name+slash+'index',()=>fy,opts);
            const route = search(root),
                app1 = await route(slash,method),
                app2 = await route(name,method);
            jest.dontMock('./index');
            jest.dontMock(c_name+slash+'index');
            
            expect(traverse).toHaveBeenCalledTimes(1);
            expect(traverse).toHaveBeenCalledWith(root);
            expect(fy).toHaveBeenCalledTimes(1);
            expect(fy).toHaveBeenCalledWith(method.toLowerCase());
            expect(app1).toBe(result1);
            expect(app2).toBe(result2);
        });
    });

});