var fs = require('fs');
var browserify = require('browserify');

browserify('./main.js').transform('babelify', {
    presets: ['es2015', 'stage-0']
})
    .bundle()
    .pipe(fs.createWriteStream('out.js'));
