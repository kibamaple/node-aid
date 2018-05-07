const Is = require('./is');

const {error} = Is;

exports.promisify = (cb) =>{
    
    return (...args) => {
        const self = this;
        return new Promise((resolve,reject)=>{
            args.push(
                (e,r)=>error(e)?reject(e):resolve(r)
            );
            cb.apply(self,args);
        });
    }
}