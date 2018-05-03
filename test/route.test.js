const method = 'METHOD',
    error = new Error(),
    errorFn = ()=>{throw error;}
    modules = [
        ['normal',{method}],
        ['path/normal',{method}],
        ['path/test/index',{method}],
        ['non',{}],
        ['error',errorFn],
        ['error/method',()=>errorFn]
    ],
    ext = '.js',
    glob = jest.fn(
        (p,o,cb) => cb(
            null, 
            modules.map(_=>_[0] + ext)
        )
    );
jest.doMock('glob',()=>glob);

const Route = require('../src/route'),
    Is = require('../src/is');
const {search} = Route,
    {fn} = Is,
    current = '.',
    sep = '/',
    root = __dirname,
    pattern = '**/*.js',
    opts = {cwd:root};

jest.dontMock('glob');

describe('route',()=>{
    
    describe('search',()=>{

        beforeAll(()=>{
            for(let module of modules)
                jest.doMock(
                    [current,module[0]].join(sep),
                    fn(module[1])?module[1]:()=>module[1],
                    {virtual: true}
                );
        });
        
        afterAll(()=>{
            for(let module of modules)
                jest.dontMock(
                    [current,module[0]].join(sep)
                );
        });

        afterEach(() => {
            glob.mockClear();
        });

        it('not found module',async ()=>{
            const route = search(root);
            
            const app = await route('/',method),
                app1 = await route('/',method);

            expect(glob).toHaveBeenCalledTimes(1);
            expect(glob).toHaveBeenCalledWith(pattern,opts,expect.anything());
            expect(app).toBeUndefined();
            expect(app1).toBeUndefined();
        });

        it('not found method',async ()=>{
            const route = search(root);
            
            const app = await route(modules[3][0],method),
                app1 = await route(modules[3][0],method);

            expect(glob).toHaveBeenCalledTimes(1);
            expect(glob).toHaveBeenCalledWith(pattern,opts,expect.anything());
            expect(app).toBeUndefined();
            expect(app1).toBeUndefined();
        });

        it('error module',async ()=>{
            const route = search(root);
            
            let err;
            try{
                await route(modules[4][0],method);
            }catch(e){
                err = e;
            }
            expect(err).toBe(error);
 
            try{
                await route(modules[4][0],method);
            }catch(e){
                err = e;
            }
            
            expect(err).toBe(error);
            expect(glob).toHaveBeenCalledTimes(1);
            expect(glob).toHaveBeenCalledWith(pattern,opts,expect.anything());
        });

        it('error method',async ()=>{
            const route = search(root);
            
            let err;
            try{
                await route(modules[5][0],method);
            }catch(e){
                err = e;
            }
            expect(err).toBe(error);

            try{
                await route(modules[5][0],method);
            }catch(e){
                err = e;
            }

            expect(err).toBe(error);
            expect(glob).toHaveBeenCalledTimes(1);
            expect(glob).toHaveBeenCalledWith(pattern,opts,expect.anything());
        });

        it('success',async ()=>{
            const route = search(root);
            
            const app = await route(modules[0][0],method),
                app1 = await route(modules[1][0],method),
                app2 = await route('path/test',method),
                app3 = await route(modules[0][0],method);

            expect(glob).toHaveBeenCalledTimes(1);
            expect(glob).toHaveBeenCalledWith(pattern,opts,expect.anything());
            expect(app).toBe(modules[0][1].method);
            expect(app1).toBe(modules[1][1].method);
            expect(app2).toBe(modules[2][1].method);
            expect(app3).toBe(modules[0][1].method);
        });
    });

});