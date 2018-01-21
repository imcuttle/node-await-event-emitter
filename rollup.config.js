// rollup.config.js
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'

export default {
  entry: 'index.js',
  output: {
    file: 'index.es5.js',
    format: 'cjs'
  },

  plugins: [
    babel({
      exclude: 'node_modules/**',
      runtimeHelpers: true

    }),
    commonjs({

    })
  ],

  watch: {
    include: '*.js'
  }
}
