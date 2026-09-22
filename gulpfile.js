import autoprefixer from "autoprefixer";
import browserSync from "browser-sync";
import gulp from "gulp";
import csso from "gulp-csso";
import postcss from "gulp-postcss";
import prettier from "gulp-prettier";
import gulpSass from "gulp-sass";
import combineMediaQueries from "postcss-combine-media-query";
import pxtorem from "postcss-pxtorem";
import sortMediaQueries from "postcss-sort-media-queries";
import * as dartSass from "sass";
import { deleteAsync } from "del";

const sass = gulpSass(dartSass);
const bs = browserSync.create();

// Пути к файлам
const paths = {
  html: "src/**/*.html",
  scss: "src/scss/**/*.scss",
  css: "src/css/**/*.css",
  js: "src/js/**/*.js",
  cssDest: "src/css"
};

// Общая конфигурация browserslist
const browsers = [
  "last 10 versions",
  "> 1%",
  "not dead",
  "ie 11"
];

// Конфигурация pxtorem
const pxtoremConfig = {};

const prettierConfig = {
	printWidth: 120,
	useTabs: true,
	singleAttributePerLine: true,
};

// Очистка docs
export function clean() {
	return deleteAsync(["docs"]);
}

// Копирование файлов в docs
export function copyFiles() {
	return gulp.src([
		"src/**/*.html",
		"src/js/**/*",
		"src/css/**/*",
		// "src/img/**/*",
		"src/favicon.*"
	], {
		base: "src"
	})
	.pipe(gulp.dest("docs"));
}

// Компиляция SCSS для dev (без autoprefixer)
export function buildCSS() {
  const plugins = [
    combineMediaQueries(),
    sortMediaQueries({
      sort: 'mobile-first'
    }),
    pxtorem(pxtoremConfig)
  ];

  return gulp.src("src/scss/style.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(postcss(plugins))
    .pipe(gulp.dest(paths.cssDest))
    .pipe(bs.stream());
}

// Компиляция для prod (с autoprefixer и минификацией)
export function buildCSSProd() {
  const plugins = [
    combineMediaQueries(),
    sortMediaQueries({
      sort: 'mobile-first'
    }),
    pxtorem(pxtoremConfig),
    autoprefixer({
      overrideBrowserslist: browsers,
      grid: 'autoplace',
      cascade: false
    })
  ];

  return gulp.src("src/scss/style.scss")
    .pipe(sass({ outputStyle: 'expanded' }).on("error", sass.logError))
    .pipe(postcss(plugins))
	.pipe(csso({
      restructure: true,        // Структурная оптимизация
      forceMediaMerge: false,   // Не объединять медиазапросы
      comments: false           // Удалять комментарии
    }))
	.pipe(prettier(prettierConfig))
    .pipe(gulp.dest(paths.cssDest));
}

// Запуск локального сервера
export function serve() {
  bs.init({
    server: {
      baseDir: "./src"
    },
    notify: false,
    open: true
  });
}

// Отслеживание изменений
export function watchFiles() {
  gulp.watch(paths.scss, buildCSS);
  gulp.watch(paths.html).on("change", bs.reload);
  gulp.watch(paths.js).on("change", bs.reload);
}

// Задача по умолчанию (dev)
export default gulp.series(
  buildCSS,
  gulp.parallel(serve, watchFiles)
);

// Задача для prod
export const build = gulp.series(
	clean,
	gulp.parallel(
		buildCSSProd,
		copyFiles
	)
);