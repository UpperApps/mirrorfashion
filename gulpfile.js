var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var clean = require('gulp-clean');

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
gulp.task('build-img', ['copy'], function() {
    gulp.src('dist/img/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/img'));
});
