const Is = require('./is');
const {array,fn,defined} = Is;

module.exports = (routes,views)=>{

    return async (path,ctx)=>{

        let route,action;
        for(route of routes)
            if(fn(action = await route(path)))
                break;
        if(!fn(action))
            throw path;
        
        const res = await action(ctx);
        let view,respond;
        for(view of views)
            if(defined(respond = await view(ctx,res)))
                break;
        return respond;

    };
};