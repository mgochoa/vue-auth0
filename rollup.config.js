import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

export default {
    name: 'vue-auth0',
    input: 'src/main.js',
    output:{
        file:`dist/index.${process.env.format}.js`,
        format: process.env.format,
    },
    plugins: [
        resolve({
            module: true, // Default: true

            // use "jsnext:main" if possible
            // – see https://github.com/rollup/rollup/wiki/jsnext:main
            jsnext: true,  // Default: false

            // use "main" field or index.js, even if it's not an ES6 module
            // (needs to be converted from CommonJS to ES6
            // – see https://github.com/rollup/rollup-plugin-commonjs
            main: true,  // Default: true
        }),
        babel({
            exclude: 'node_modules/**'

        }),
        (process.env.NODE_ENV === 'production' && uglify())
    ],
    external: [ 'auth0-js/WebAuth','auht0-js','WebAuth' ] //
};