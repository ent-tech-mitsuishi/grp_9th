'use strict';

// パッケージのインストール
// gulp
const gulp = require('gulp');
// browser-sync
const browserSync = require('browser-sync');
// html
const ejs = require('gulp-ejs');
const htmlbeautify = require('gulp-html-beautify');
const rename = require('gulp-rename');
const plumber = require('gulp-plumber');
const del = require('del');
const readConfig = require('read-config');
// sass
const sass = require('gulp-sass')(require('sass'));
// library
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
// webp
const webp = require('gulp-webp');
// image
const changed = require('gulp-changed');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');

// webpack
const webpackStream = require('webpack-stream');
const webpack = require('webpack');
const webpackConfig = require('./setting/webpack.config');
const uglify = require('gulp-uglify');

// through2
const through = require('through2');
const PluginError = require('plugin-error');

// 変数一覧
const SRC = './src';
const CONFIG = './src/config';
const DEVELOP = 'develop';
const RELEASE = 'release';
const BASE_PATH = '/';
const FileSrc = {
  ejs: `${SRC}/ejs/**/*.ejs`,
  sass: `${SRC}/sass/**/*.scss`,
  js: `${SRC}/js/**/*.js`,
  img: `${SRC}/assets/img/**/*`,
  config: `${CONFIG}/**/*`,
};
const isOnetrustCheck = false;

// onetrust words
const searchString = 'https://cdn.cookielaw.org/scripttemplates/otSDKStub.js';
const commentRegex = new RegExp(`<!--.*?${searchString}.*?-->`, 'gi');

//********************************************************
// html
//********************************************************
// develop内のhtmlファイルを削除
const clean = (done) => {
  return del([
    `${DEVELOP}/**`,
    `!${DEVELOP}`,
    `!${DEVELOP}/sitemap.xml`,
    `!${DEVELOP}/assets/**`,
  ]);
};

// ejs
const ejsTask = (done) => {
  const config = readConfig(`${CONFIG}/meta.json`);
  return gulp
    .src([`${SRC}/ejs/**/*ejs`, '!' + `${SRC}/ejs/**/_*ejs`])
    .pipe(plumber())
    .pipe(
      ejs(
        {
          meta: config,
        },
        {}
      )
    )
    .pipe(
      rename({
        extname: '.php',
      })
    )
    .pipe(
      through.obj(function (file, enc, cb) {
        if (isOnetrustCheck) {
          if (file.isBuffer()) {
            const content = file.contents.toString(enc);
            let containsString = false;
            let isCommentedOut = false; // コメントアウトされているかどうかのフラグ

            // ファイル内のすべての行をチェック
            const lines = content.split(/\r?\n/);
            lines.forEach((line, index) => {
              if (line.includes(searchString)) {
                containsString = true;
                if (commentRegex.test(line)) {
                  isCommentedOut = true; // 特定の文字列がコメントアウトされている場合
                }
              }
            });

            if (!containsString) {
              this.emit(
                'error',
                new PluginError(
                  'check-html',
                  `Onetrustタグが見つかりません ${file.path}`
                )
              );
              return false;
            } else if (isCommentedOut) {
              this.emit(
                'error',
                new PluginError(
                  'check-html',
                  `Onetrustタグがコメントアウトされています ${file.path}`
                )
              );
              return false;
            }
          }
        }
        cb(null, file);
      })
    )
    .pipe(
      htmlbeautify({
        indent_size: 2,
        indent_char: ' ',
        max_preserve_newlines: 0,
        preserve_newlines: false,
        extra_liners: [],
        // Keep script contents untouched to avoid breaking embedded PHP tags.
        unformatted: [
          'script',
          'br',
          'hr',
          'img',
          'input',
          'meta',
          'link',
          'area',
          'base',
          'col',
          'embed',
          'source',
          'track',
          'wbr',
        ],
      })
    )
    .pipe(gulp.dest(`${DEVELOP}/`));
};

// タスク化
const html = gulp.series(clean, ejsTask);

//********************************************************
//css
//********************************************************
// sass
const sassTask = (done) => {
  const searchCss = ['onetrust', 'ot-', 'cookie-'];

  return gulp
    .src(FileSrc.sass, { sourcemaps: true })
    .pipe(
      sass({
        includePaths: ['node_modules'],
      })
    )
    .pipe(
      through.obj(function (file, enc, cb) {
        let cssError = false;
        const contents = file.contents.toString(enc);
        searchCss.forEach((searchString) => {
          if (contents.includes(searchString)) {
            cssError = true;
          }
        });
        if (cssError) {
          console.log(`OneTrustのスタイルが上書きされています${file.path}".`);
          return false;
        }
        cb(null, file);
      })
    )
    .pipe(gulp.dest(`${DEVELOP}/assets/css`, { sourcemaps: 'sourcemaps' }));
};

const cssMin = () => {
  return gulp
    .src(`${DEVELOP}/**/*.css`)
    .pipe(
      cleanCSS({
        compatibility: 'ie8',
      })
    )
    .pipe(gulp.dest(`${RELEASE}/`));
};

// タスク化
const css = gulp.series(sassTask);

//********************************************************
// JavaScript
//********************************************************
// 開発環境用webpack
const webpackTask = (done) => {
  webpackStream(webpackConfig, webpack).pipe(gulp.dest(`${DEVELOP}/assets/js`));
  done();
};

const uglifyTask = (done) => {
  return gulp
    .src(`${DEVELOP}/**/*.js`)
    .pipe(
      uglify({
        compress: {
          drop_console: true,
        },
        output: {
          comments: /^!/,
        },
      })
    )
    .pipe(gulp.dest(`${RELEASE}/`));
};

// タスク化
const js = gulp.parallel(webpackTask);

//********************************************************
//		image_min
//********************************************************
const imageminTask = (done) => {
  return gulp
    .src(`${DEVELOP}/**/assets/**/*.+(jpg|jpeg|png|gif|svg|ico)`)
    .pipe(changed(`${RELEASE}/assets/img`))
    .pipe(imagemin([pngquant()]))
    .pipe(imagemin())
    .pipe(gulp.dest(`${RELEASE}`));
};
exports.imagemin = imageminTask;

//********************************************************
//		webp
//********************************************************
gulp.task('webp', () => {
  return (
    gulp
      .src(`${DEVELOP}/assets/img/**/*.+(jpg|jpeg|png|gif)`)
      // rename処理を追加
      .pipe(
        rename(function (path) {
          path.dirname.replace(/assets[\/\\]img[\/\\]?/, '');
        })
      )
      .pipe(webp())
      .pipe(gulp.dest(`${DEVELOP}/assets/data/webp/`))
  );
});

//********************************************************
//		clean
//********************************************************

const cleanTask = (done) => {
  return del(`${RELEASE}/`);
};

//********************************************************
//		copy
//********************************************************

const copyTask = (done) => {
  return gulp
    .src([`${DEVELOP}/**/*.html`, `${DEVELOP}/**/assets/data/**`], {
      base: `${DEVELOP}`,
    })
    .pipe(gulp.dest(`${RELEASE}/`));
};

//********************************************************
// Serve
//********************************************************
function reload(done) {
  browserSync.reload();
  done();
}

// PHP環境用のBrowserSync（プロキシモード）
const BrowserSyncPHP = (done) => {
  browserSync({
    proxy: 'localhost:8081', // PHPサーバーのポート
    startPath: BASE_PATH,
    ghostMode: false,
    open: 'external',
    files: [
      `${DEVELOP}/**/*.html`,
      `${DEVELOP}/assets/**/*.css`,
      `${DEVELOP}/assets/**/*.js`,
      `./php/**/*.php`, // PHPファイルもwatch
    ],
    watchOptions: {
      ignoreInitial: true,
    },
  });
  // srcディレクトリの変更をwatch
  gulp.watch(FileSrc.ejs, gulp.series(html, reload));
  gulp.watch(FileSrc.sass, gulp.series(css, reload));
  gulp.watch(FileSrc.js, gulp.series(js, reload));
  // PHPファイルの変更をwatch
  gulp.watch('./php/**/*.php', reload);
  done();
};

// 通常のBrowserSync（developディレクトリを直接サーブ）
const BrowserSync = (done) => {
  browserSync({
    server: {
      baseDir: DEVELOP,
    },
    startPath: BASE_PATH,
    ghostMode: false,
    open: 'external',
  });
  gulp.watch(FileSrc.ejs, gulp.series(html, reload));
  gulp.watch(FileSrc.sass, gulp.series(css, reload));
  gulp.watch(FileSrc.js, gulp.series(js, reload));
  done();
};

const serve = gulp.series(BrowserSync);
const servePHP = gulp.series(BrowserSyncPHP);

// webpack追加
exports.d = gulp.parallel(serve);
exports.php = gulp.parallel(servePHP); // PHP環境用のwatch
exports.r = gulp.series(
  cleanTask,
  html,
  cssMin,
  uglifyTask,
  imageminTask,
  copyTask
);
