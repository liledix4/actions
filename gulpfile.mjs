import gulp from 'gulp';
const { dest, src, parallel, series, task } = gulp;
// import { deleteAsync } from 'del';
import markdown from 'gulp-markdown';
import fileinclude from 'gulp-file-include';

const config = {
    prefix: {
        includeHTML: '@@',
        includeMD: '@#'
    }
}
const path = {
    temp: {
        main: './temp/',
        markdown: './temp/markdown/',
        html: './temp/html/'
    },
    src: {
        main: './src/',
        html: './src/html/',
        html_include: './src/html_include/',
        gears: './src/gears/',
        markdown: './src/markdown/',
        json: './src/json/'
    },
    static: './static/',
    offline: './offline/',
    build: {
        main: './docs/',
        html: './docs/',
        gears: './docs/gears/',
        offline: './docs/offline/'
    }
}

// function del(fPath) {
//     return  deleteAsync(fPath, {force: true});
// }
// function cleanBuild() {
//     return  del(path.build.main);
// }
// function cleanTemp() {
//     return  del(path.temp.main);
// }
// function cleanTemp_Markdown() {
//     return  del(path.temp.markdown);
// }

function MarkdownParseToHTML() {
    return  src(path.src.markdown + '**/*.md', { encoding: false })
                .pipe(markdown())
                .pipe(dest(path.temp.markdown));
}
function MarkdownIncludeToHTML() {
    return  src(path.src.html + '**/*.html', { encoding: false })
                .pipe(fileinclude({
                    prefix: config.prefix.includeMD,
                    basepath: path.temp.markdown
                }))
                .pipe(dest(path.temp.html));
}
function JSONTemp() {
    return  src(path.src.json + '**/*.json', { encoding: false })
                .pipe(dest(path.temp.html));
}
function includeHTML() {
    return  src(path.temp.html + '**/*.html', { encoding: false })
                .pipe(fileinclude({
                    prefix: config.prefix.includeHTML,
                    basepath: path.src.html_include
                }))
                .pipe(dest(path.build.html));
}
function addGears() {
    return  src(path.src.gears + '**/*', { encoding: false })
                .pipe(dest(path.build.gears));
}
function addStatic() {
    return  src(path.static + '**/*', { encoding: false })
                .pipe(dest(path.build.main));
}
function addOffline() {
    return  src(path.offline + '**/*', { encoding: false })
                .pipe(dest(path.build.offline));
}

// task('clean', parallel(cleanBuild, cleanTemp));
task('default', series(
    series(MarkdownParseToHTML, MarkdownIncludeToHTML, JSONTemp),
    parallel(includeHTML, addGears, addStatic, addOffline)
));
// task('default', series(
//     cleanBuild,
//     series(MarkdownParseToHTML, MarkdownIncludeToHTML, cleanTemp_Markdown, JSONTemp),
//     parallel(includeHTML, addGears, addStatic, addOffline),
//     cleanTemp
// ));