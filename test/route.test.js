const method = 'METHOD',
modules = [
    ['normal',{method}],
    ['path/normal',{method}],
    ['path/test/index',{method}],
    ['non',{}],
],
ext = '.js',
glob = jest.fn(
    (p,o,cb) => cb(
        null, 
        modules.map(_=>_[0] + ext)
    )
);
jest.doMock('glob',()=>glob);

const Route = require('../src/route');
const {search} = Route,
    current = '.',
    sep = '/',
    root = 'root',
    pattern = '**/*.js',
    opts = {cwd:root},
    error = new Error(),
    errorFn = ()=>{throw error;};

jest.dontMock('glob');

describe('route',()=>{
    
    describe('search',()=>{

        beforeAll(()=>{
            for(let module of modules)
                jest.doMock(
                    (current,root,module[0]).join(sep),
                    ()=>module[1]
                );
        });
        
        afterAll(()=>{
            for(let module of modules)
                jest.dontMock(
                    (current,root,module[0]).join(sep)
                );
        });

        afterEach(() => {
            glob.mockReset();
        });

        it('not found module',()=>{
            const route = search(root);

            const app = await route('/','get');

            expect(glob).toHaveBeenCalledTimes(1);
            expect(glob).toHaveBeenCalledWith(pattern,opts);
            expect(app).toBeUndefined();
        });

        it.skip('multi not found module',()=>{});
        it.skip('error',()=>{});
        it.skip('multi error',()=>{});
        it.skip('success',()=>{});
        it.skip('multi success',()=>{});
    });

});