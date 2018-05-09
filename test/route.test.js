const glob = jest.fn(),
    opts = {virtual: true};

jest.doMock('glob',()=>glob,opts);
const Route = require('../src/route');
jest.dontMock('glob');
jest.resetModules();

const {search} = Route,
    parent = '**/*.js',
    current = '.',
    cwd = __dirname,
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
            glob.mockReset();
            jest.resetModules();
        });

        it('not found module with empty',async ()=>{
            glob.mockImplementation(
                (p,o,cb)=>cb(undefined,[])
            );
            const route = search(cwd),
                app = await route(name,method),
                app1 = await route(s_name,method);

            expect(glob).toHaveBeenCalledTimes(1);
            expect(glob).toHaveBeenCalledWith(parent,{cwd},expect.anything());
            expect(app).toBeUndefined();
            expect(app1).toBeUndefined();
        });

        it('not found module',async ()=>{
            glob.mockImplementation(
                (p,o,cb)=>cb(undefined,['index.js'])
            );
            const route = search(cwd),
                app = await route(name,method),
                app1 = await route(s_name,method);

            expect(glob).toHaveBeenCalledTimes(1);
            expect(glob).toHaveBeenCalledWith(parent,{cwd},expect.anything());
            expect(app).toBeUndefined();
            expect(app1).toBeUndefined();
        });

        it('not found method',async ()=>{
            const fy = jest.fn();

            glob.mockImplementation(
                (p,o,cb)=>cb(undefined,[f_name])
            );
            const route = search(cwd);
            
            jest.doMock(c_name,()=>({}),opts);
            const app = await route(name,method);
            jest.dontMock(c_name);
            jest.resetModules();

            jest.doMock(c_name,()=>fy,opts);
            const app1 = await route(s_name,method);
            jest.dontMock(c_name);

            expect(glob).toHaveBeenCalledTimes(1);
            expect(glob).toHaveBeenCalledWith(parent,{cwd},expect.anything());
            expect(fy).toHaveBeenCalledTimes(1);
            expect(fy).toHaveBeenCalledWith(method.toLowerCase());
            expect(app).toBeUndefined();
            expect(app1).toBeUndefined();
        });

        it('error glob',async ()=>{
            glob.mockImplementation(
                (p,o,cb)=>cb(error)
            );
            let err;
            const route = search(cwd);
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

            expect(glob).toHaveBeenCalledTimes(1);
            expect(glob).toHaveBeenCalledWith(parent,{cwd},expect.anything());
        });

        it('error module',async ()=>{
            glob.mockImplementation(
                (p,o,cb)=>cb(undefined,[f_name])
            );
            jest.doMock(c_name,()=>errorFn,opts);
            let err;
            const route = search(cwd);
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
            
            expect(glob).toHaveBeenCalledTimes(1);
            expect(glob).toHaveBeenCalledWith(parent,{cwd},expect.anything());
        });
        
        it('error method',async ()=>{
            const fy = jest.fn(errorFn);
            
            glob.mockImplementation(
                (p,o,cb)=>cb(undefined,[f_name])
            );
            let err;
            const route = search(cwd);
            
            jest.doMock(c_name,()=>fy,opts);
            try{
                await route(name,method);
            }catch(e){
                err = e;
            }
            expect(err).toBe(error);
            jest.dontMock(c_name);
            
            expect(glob).toHaveBeenCalledTimes(1);
            expect(glob).toHaveBeenCalledWith(parent,{cwd},expect.anything());
            expect(fy).toHaveBeenCalledTimes(1);
            expect(fy).toHaveBeenCalledWith(method.toLowerCase());
        });
        
        it('success',async ()=>{
            const fy = jest.fn(),
                result1 = Symbol('result1'),
                result2 = Symbol('result2');
            
            glob.mockImplementation(
                (p,o,cb)=>cb(
                    undefined,
                    [f_name,name+slash+f_name]
                )
            );
            fy.mockReturnValue(result2)

            jest.doMock(c_name,()=>({method:result1}),opts);
            jest.doMock(c_name+slash+name,()=>fy,opts);
            const route = search(cwd),
                app1 = await route(s_name,method),
                app2 = await route(name+slash+name,method);
            jest.dontMock(c_name);
            jest.dontMock(c_name+slash+name);
            
            expect(glob).toHaveBeenCalledTimes(1);
            expect(glob).toHaveBeenCalledWith(parent,{cwd},expect.anything());
            expect(fy).toHaveBeenCalledTimes(1);
            expect(fy).toHaveBeenCalledWith(method.toLowerCase());
            expect(app1).toBe(result1);
            expect(app2).toBe(result2);
        });

        it('success index',async ()=>{
            const fy = jest.fn(),
                result1 = Symbol('result1'),
                result2 = Symbol('result2');
            
            glob.mockImplementation(
                (p,o,cb)=>cb(
                    undefined,
                    ['index.js',name+slash+'index.js']
                )
            );
            fy.mockReturnValue(result2)

            jest.doMock('./index',()=>({method:result1}),opts);
            jest.doMock(c_name+slash+'index',()=>fy,opts);
            const route = search(cwd),
                app1 = await route(slash,method),
                app2 = await route(name,method);
            jest.dontMock('./index');
            jest.dontMock(c_name+slash+'index');
            
            expect(glob).toHaveBeenCalledTimes(1);
            expect(glob).toHaveBeenCalledWith(parent,{cwd},expect.anything());
            expect(fy).toHaveBeenCalledTimes(1);
            expect(fy).toHaveBeenCalledWith(method.toLowerCase());
            expect(app1).toBe(result1);
            expect(app2).toBe(result2);
        });
    });

});