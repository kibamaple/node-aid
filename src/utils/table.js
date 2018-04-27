function count(_) {
    return _.length;
}

function check(length) {
    return _=>count(_) === length;
}

function search(index){
    return _=>_[index];
}

function match(col){
    return _=>_.map(r=>r[col]);
}

function get(row,col){
    return _=>_[row][col];
}

function first(col){
    return get(0,col);
}

let empty = check(0),
    top = search(0);
module.exports = {
    count,check,empty,search,top,match,get,first
}