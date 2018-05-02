const Is = require('./is');
const {undef,fn} = Is;

async function exec (check,path,method,route,...handles){
    const app = await route(path,method);
    let handle,respond;
    if(undef(app))
        return app;
    for(handle of handles)
        if(check(respond = await handle(app)))
            break;
    return respond;
}

exports.koa = (route,...handles)=>{

    return async (ctx,next) => {
        const {path,method} = ctx,
            respond = await exec(fn,path,method,route,...handles);
        return respond?respond(ctx,next):next();
    }

};