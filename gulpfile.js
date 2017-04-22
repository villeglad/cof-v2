var elixir = require('laravel-elixir');
elixir.config.assetsPath = 'src';
elixir.config.publicPath = 'dist';

elixir(function(mix) {
    mix.browserSync({
        files: ['**/*.html', '**/*.css', '**/*.js']
    });
    mix.browserify('app.js');
    mix.sass('app.scss');
    mix.copy('src/index.html', 'dist/index.html');
});
