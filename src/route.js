const Path = require('path'),
    JS = require('./js'),
    Is = require('./is');

const {sep,relative,basename,dirname} = Path,
    {fn,object} = Is,
    {traverse} = JS,
    root = '',
    dot = '.',
    ext = '.js',
    slash = '/',
    index = 'index';

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
    return path[0] === slash?path.slice(1):path;
}

function resolveMethod(method){
    return method.toLowerCase();
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