const Path = require('path'),
    JS = require('./js'),
    Is = require('./is');

const {sep,relative,basename,dirname} = Path,
    {fn,object,string} = Is,
    {traverse} = JS,
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
    if(fn(path.toString))
        return path.toString();
    throw new Error(path_msg+path);
}

function resolveMethod(method){
    if(fn(method.toLowerCase))
        return method.toLowerCase();
    throw new Error(method_msg + method);
}

exports.search = (root)=>{
    
    const fixed = toURI(relative(__dirname,root)),
        mappings = traverse(root)
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