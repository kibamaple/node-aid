const Is = require('./is');
const {undef,object,defined} = Is;

function $mapGet (key,target,mapping,...args){

    if(target.hasOwnProperty(key))
        return target[key];

    let ns;
    if(undef(ns = mapping[key]))
        return $queueGet(key,target,...args);
    
    let n,arg,value;
    for(n of ns){
        for(arg of args)
            if(defined(value = arg[n]))
                break;
        if(defined(value))
            break;
    }

    return target[key] = value;
}

function $queueGet (key,target,...args) {

    if(!target.hasOwnProperty(key)){
        let value,arg;
        for(arg of args)
            if(
                object(arg)
                && defined(arg[key])
            ){
                value = arg[key];
                break;
            }
        target[key] = value;
    }

    return target[key];
}

module.exports = (mapping,...args)=>{
    let get = defined(mapping)
        ?(target,key)=>$mapGet(key,target,mapping,...args)
        :(target,key)=>$queueGet(key,target,...args);
    return new Proxy({},{get});
}