

module.exports = (function(){

    var Helper = {};

    Helper.getOpt = function(id) {
        var args = {};
        process.argv.forEach(function (val, index, array) {
            var sp = val.split('='),
                param = sp[0] || '',
                data = sp[1];

            if (param.length > 0 && /^--/i.test(param) && typeof data !== 'undefined') {
                data = (data === 'true') ? true : (data === 'false') ? false : data;
                args[param.replace(/^--/i, '')] = data;
            }
            
        });

        return (args[id]) ? args[id] : undefined;

    };

    return Helper;

}());