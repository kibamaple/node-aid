const Path = require('path'),
    Util = require('util'),
    Glob = require('glob'),
    Is = require('./is');

const {sep,relative,basename,dirname} = Path,
    {fn,object,string,defined} = Is,
    {promisify} = Util,
    glob = promisify(Glob),
    pattern = '**/*.js',
    root = '',
    dot = '.',
    ext = '.js',
    slash = '/',
    index = 'index',
    path_msg = 'path can\'t toString:',
    method_msg = 'method can\'t toLowerCase:';

function toURI(path){
    return slash === sep?path:path.replace(sep,slash);
}

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
    if(string(path))
        return path[0] === slash?path.slice(1):path;
    if(defined(path) && path!=null && fn(path.toString))
        return path.toString();
}

function resolveMethod(method){
    if(defined(method) && method!=null && fn(method.toLowerCase))
        return method.toLowerCase();
}

module.exports = (cwd)=>{
    
    const fixed = toURI(relative(__dirname,cwd)),
        mappings = glob(pattern,{cwd})
            .then(_=>init(fixed,_));

    return async (ctx) => {
        const {path,method} = ctx || {},
            cache = await mappings;
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