const Is = require('./is');
const {undef,fn} = Is;

async function route (path,method,load,handle){
    const app = await load(path,method);
    return undef(app)?app:await handle(app);
}

exports.koa = (load,handle)=>{

    return async (ctx,next) => {
        const {path,method} = ctx,
            respond = await route(path,method,load,handle);
        return fn(respond)?respond(ctx,next):next();
    }

};