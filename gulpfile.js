var gulp = require('gulp'),
    imagemin = require('gulp-imagemin'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    htmlReplace = require('gulp-html-replace'),
    uglify = require('gulp-uglify'),
    usemin = require('gulp-usemin'),
    cssmin = require('gulp-cssmin');

//Obs.:
//1- O Gulp por padrão trabalha assincronamente, ao contrário do Grunt que é
//síncrono.
//O Gulp trabalha com os dados em memória e faz apenas uma leitura e uma gravação
//em disco, diferentemente do Grunt que para cada transação lê e grava os dados
//em disco. Isso torna o Gulp ainda mais performático.

// tarefa padrão que chama todas as outras. Seria o método main do script.
gulp.task('default', ['copy'], function() {
  gulp.start('build-img', 'usemin');
});

//Limpa a pasta de distribuição para receber os novos arquivos.
gulp.task('clean', function() {
    return gulp.src('dist')
        .pipe(clean());
});

//Copia os arquivos da pasta src (arquivos originais) para a pasta de distribuição (dist).
gulp.task('copy', ['clean'], function() {
    return gulp.src('src/**/*')
        .pipe(gulp.dest('dist'));
});

//A minificação das imagens na pasta de distribuição (dist).
gulp.task('build-img', function() {
    gulp.src('dist/img/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/img'));
});

gulp.task('usemin', function() {
  return gulp.src('dist/**/*.html')
  .pipe(usemin({
    js: [uglify],
    css: [cssmin]
  }))
  .pipe(gulp.dest('dist'))
});
