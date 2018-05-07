const Glob = require('glob'),
    Promise = require('./promise');

const {promisify} = Promise,
    glob = promisify(Glob),
    pattern = '**/*.js';

exports.traverse = (cwd)=>{
    return glob(pattern,{cwd});
};