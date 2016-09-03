var gulp = require('gulp'),
    imagemin = require('gulp-imagemin'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    htmlReplace = require('gulp-html-replace'),
    uglify = require('gulp-uglify'),
    usemin = require('gulp-usemin'),
    cssmin = require('gulp-cssmin'),
    browserSync = require('browser-sync'),
    jshint = require('gulp-jshint'),
    jshintStylish = require('jshint-stylish'),
    csslint = require('gulp-csslint'),
    autoprefixer = require('gulp-autoprefixer'),
    less = require('gulp-less');

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

//O plugin usemin permite fazer anotações no html para facilitar o trabalho com
//os plugins de minificação de css e js. Neste caso estou trabalhando com o
//uglify e o cssmin.
//O autoprefixer inclui o prefixo dos navegadores para que eles supertem os
//recursos do CCS3. Ele lê do arquivo browserslist o nº de versões a serem suportadas.
gulp.task('usemin', function() {
    return gulp.src('dist/**/*.html')
        .pipe(usemin({
            js: [uglify],
            css: [autoprefixer, cssmin]
        }))
        .pipe(gulp.dest('dist'))
});

//Cria um servidor local com o plugin browser-sync.
gulp.task('server', function() {

    //O plugin browser-sync permite criar um servidor local que fica sincronozado com
    //o navegador padrão do compuotador. Ao ser executado ele também fornece um link
    //para permitir que ele seja acessado por outros dispositivos na mesma rede, como
    //um celular, por exemplo.
    browserSync.init({
        server: {
            baseDir: 'src'
        }
    });

    //A função gulp.watch fica escutando se houve alguma alteração nos arquivos da
    //fonte especificada e chama a função passada no segundo parâmetro quando
    //disparado o evento especificado.
    gulp.watch('src/**/*').on('change', browserSync.reload);

    //Habilita o plugin jshint que permite exibir os erros de código javascript
    //no console.
    gulp.watch('src/js/**/*.js').on('change', function(event) {
        console.log("Linting " + event.path);
        gulp.src(event.path)
            .pipe(jshint())
            .pipe(jshint.reporter(jshintStylish));
    });

    //Habilita o plugin csshint que permite exibir os erros de código javascript
    //no console.
    gulp.watch('src/css/**/*.css').on('change', function(event) {
        console.log("Linting " + event.path);
        gulp.src(event.path)
            .pipe(csslint())
            .pipe(csslint.reporter());
    });

    //Watcher que usa o gulp-less pra fazer a precompilação de CSS.
    gulp.watch('src/less/**/*.less').on('change', function(event) {
        var stream = gulp.src(event.path)
            .pipe(less().on('error', function(erro) {
                console.log('LESS, erro de compilação: ' + erro.filename);
                console.log(erro.message);
            }))
            .pipe(gulp.dest('src/css'));
    });
});
