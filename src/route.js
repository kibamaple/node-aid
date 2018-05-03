const Glob = require('glob'),
    Path = require('path'),
    Is = require('./is');

function promisify(cb){
    return function (...args) {
        const self = this;
        return new Promise((resolve,reject)=>{
            args.push(
                (e,r)=>e === undefined || e===null?resolve(r):reject(e)
            );
            cb.apply(self,args);
        });
    }
}

function toURI(path){
    return slash === sep?path:path.replace(sep,slash);
}

const {sep,relative,basename,dirname} = Path,
    {fn,object} = Is,
    glob = promisify(Glob),
    pattern = '**/*.js',
    root = '',
    dot = '.',
    ext = '.js',
    slash = '/',
    index = 'index';

function init(fixed,files){
    const cache = {};
    let n,d,u;
    for(let file of files){
        n = basename(file,ext);
        d = dirname(file);
        u = d == dot?root:toURI(d)
        k = u === root?n:[u,n].join(slash);
        cache[k] = [fixed,k].join(slash);
        if(
            n == index 
            && !cache.hasOwnProperty(u)
        ){
            cache[u] = cache[k];
        }
    }
    return cache;
}

function resolvePath(path){
    return path[0] === slash?path.slice(1):path;
}

function resolveMethod(method){
    return method.toLowerCase();
}

exports.search = (cwd)=>{

    const fixed = toURI(relative(__dirname,cwd)),
        mappings = glob(pattern,{cwd})
            .then(_=>init(fixed,_));

    return async (path,method) => {
        const cache = await mappings;
        let uri,module,action;
        if(uri = cache[resolvePath(path)]){
            module = require(uri);
            action = resolveMethod(method);
            if(object(module))
                return module[action];
            if(fn(module))
                return module(action);
        }
    };

};