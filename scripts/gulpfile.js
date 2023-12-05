/**
 * @name: gulpfile
 * @author mahai
 * @date 2022/7/8 2:33 PM
 * @description gulpfile
 */
const fs = require("fs");
const gulp = require("gulp");
const path = require("path");
const cleanCSS = require("gulp-clean-css");
const rename = require("gulp-rename");
const concat = require("gulp-concat");
const replace = require("gulp-replace");
const sourcemaps = require("gulp-sourcemaps");
const size = require("gulp-filesize");
const postcssPresetEnv = require("postcss-preset-env");
const postcss = require("gulp-postcss");
const resolve = dir => path.join(__dirname, ".", dir);
const libDir = resolve("../lib");
const esDir = resolve("../es");
const scssDir = resolve("../src/**/*.scss");
const indexJsDir = resolve("../src/**/style.js");

// 复制 postcss 文件到 lib es 文件夹下
// gulp.task("copy-postcss", () => {
//     return gulp
//         .src(scssDir)
//         .pipe(sourcemaps.init())
//         .pipe(sourcemaps.write("."))
//         .pipe(gulp.dest(libDir))
//         .pipe(gulp.dest(esDir));
// });
// 根据 index.js 创建一个全新的 css.js 供按需加载 styel:'css' 使用
// gulp.task("replace-indexjs", () => {
//     return gulp
//         .src(indexJsDir)
//         .pipe(sourcemaps.init())
//         .pipe(replace("scss", "css"))
//         .pipe(
//             rename(function (path) {
//                 path.basename = "css";
//                 path.extname = ".js";
//             })
//         )
//         .pipe(sourcemaps.write("."))
//         .pipe(gulp.dest(libDir))
//         .pipe(gulp.dest(esDir));
// });

// 编译 sass 文件到 es 和 lib 文件夹下
gulp.task("compile-postcss", () => {
    return (
        gulp
            .src(scssDir)
            // .pipe(sourcemaps.init())
            .pipe(
                postcss([
                    // 编译.pcss 文件
                    postcssPresetEnv({
                        stage: 3,
                        features: {
                            "custom-properties": true,
                            "nesting-rules": true
                        },
                        browsers: "last 2 versions"
                    })
                ])
            )
            .pipe(
                rename(function (path) {
                    path.extname = ".css";
                })
            )
            // 压缩 css 文件
            .pipe(cleanCSS({ inline: ["none"] }))
            // .pipe(sourcemaps.write("."))
            .pipe(gulp.dest(libDir))
            .pipe(gulp.dest(esDir))
    );
});

gulp.task("compile", gulp.series(gulp.parallel("compile-postcss")));
