export default  function startsWith(prefix) {
    return function(str) {
        return str.indexOf(prefix) === 0;
    };
}

