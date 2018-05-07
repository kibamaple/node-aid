const glob = jest.fn(),
    opts = {virtual: true};

jest.doMock('glob',()=>glob,opts);
const JS = require('../src/js');
jest.dontMock('glob');

const {traverse} = JS,
    parent = '**/*.js',
    error = new Error();

describe('js',()=>{
    describe('traverse',()=>{

        afterEach(()=>{
            glob.mockReset();
        });

        it('error',async ()=>{
            const cwd = Symbol();
            
            glob.mockImplementation((p,o,cb)=>cb(error));
            let err;
            try{
                await traverse(cwd); 
            }catch(e){
                err = e;
            }

            expect(err).toBe(error);
            expect(glob).toHaveBeenCalledTimes(1);
            expect(glob).toHaveBeenCalledWith(parent,{cwd},expect.anything());
        });

        it('success',async ()=>{
            const cwd = Symbol(),
                result = Symbol();
            
            glob.mockImplementation((p,o,cb)=>cb(undefined,result));
            const r = await traverse(cwd); 

            expect(r).toBe(result);
            expect(glob).toHaveBeenCalledTimes(1);
            expect(glob).toHaveBeenCalledWith(parent,{cwd},expect.anything());
        });

    });
});