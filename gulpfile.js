const { src, dest, lastRun, watch, parallel, series } = require('gulp');
const webpack = require('webpack')
const ts = require("gulp-typescript");
const del = require('del');

let webpackConfig = require('./webpack.config.js')

// runs webpack using the above config
function renderer(cb) {
    // run webpack
    return new Promise((resolve, reject) => {
        webpack(webpackConfig, (err, stats) => {
            if (err) {
                return reject(err)
            }
            if (stats.hasErrors()) {
                return reject(new Error(stats.compilation.errors.join('\n')))
            }
            resolve()
        })
    })
}
// copies all .js files from app/main to dist/main
function copyMain(cb) {
    return src('app/main/*.js', { since: lastRun(copyMain) })
        .pipe(dest('dist/main/'));

}

// Runs .ts files in app/main through the typescript compiler, then places them in dist/main
function tsMain(cb) {
    return src('app/main/*.ts', { since: lastRun(tsMain) })
        .pipe(ts({
            module: "commonjs",
            removeComments: true,
            isolatedModules: true

        }))
        .pipe(dest('dist/main/'));
}

function clean(cb) {
    return del(['dist'], cb);
}

//if (process.env.NODE_ENV === 'production') 

exports.default = parallel(renderer, copyMain, tsMain)
exports.clean = clean
exports.main = parallel(copyMain, tsMain)

exports.watch = function () {
    //watch('app/renderer/*', renderer);
    //watch('app/renderer/*.css', renderer);

    watch('app/main/*.js', copyMain);
    watch('app/main/*.ts', tsMain);

}