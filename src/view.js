const Is = require('./is');
const {array,fn,defined} = Is;

function base(ctx,res){
    return res;
}

module.exports = (route)=>{
    if(fn(route))
        return async (ctx,res)=>{

            let r_ctx,args;
            if(array(res)){
                r_ctx = res[0];
                args = res.slice(1);
            }else{
                r_ctx = res;
            }

            const action = await route(r_ctx);
            if(fn(action))
                return await action(ctx,...args);
        };
    
    if(defined(route))
        return ()=>route;

    return base;
}