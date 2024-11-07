const { src, dest, watch, series, parallel } = require('gulp')
const fs       = require('fs-extra')
const util     = require('util')
const path     = require('path')
const exec     = util.promisify(require('child_process').exec)
const rename   = require('gulp-rename')
const concat 	 = require('gulp-concat');
const esbuild  = require('esbuild')
const through  = require('through2')

const source = {
	css : 'src/scss',
	js	: 'src/js',
}

const compiled = {
	css : 'www/assets/css',
	js	: 'www/assets/js',
}

let filtered_css = []

/**
 * Clean the compiled directory.
 *
 * @function clean
 * @returns {Promise}
 */
function clean() {
  return new Promise(function (resolve) {
    for (const [key, value] of Object.entries(compiled)) {
      fs.emptyDirSync(value)
    }
    resolve()
  })
}

/**
 * Compile all sass files in `source.css` and save them to `compiled.css`.
 *
 * If `filtered_css` is not empty, the function will compile each file in it
 * and save the result to the same path but with `.css` extension instead of
 * `.scss`.
 *
 * Otherwise, it will compile the entire `source.css` directory and save the
 * result to `compiled.css`.
 *
 * @function css
 * @returns {Promise}
 */
function css() {
  return new Promise(async function (resolve) {
    if (filtered_css.length) {
      for (const file of filtered_css) {
        const dest = file.replace(
          path.join(__dirname, source.css),
          path.join(__dirname, compiled.css)
        ).slice(0, -4) + 'css'
        await exec(`sass --source-map --embed-sources ${file} ${dest} --quiet`).catch(err => console.log(err.stderr))
      }
    } else {
      await exec(`sass --source-map --embed-sources ${source.css}:${compiled.css} --quiet`).catch(err => console.log(err.stderr))
    }
    resolve()
  })
}

/**
 * Watches all sass files in `source.css` and recompiles them if they or any
 * of their dependencies change.
 *
 * If a file is added or changed, it will be compiled only if it's not a partial
 * (i.e., its name doesn't start with an underscore) or if any file that imports
 * it has changed.
 *
 * If a file is deleted, its compiled counterpart will also be deleted.
 *
 * @function css_watch
 * @returns {Function} A function that returns a promise that resolves when the
 * watch is set up.
 */
function css_watch() {
  watch(source.css).on('all', async function (event, target) {
    const obj = path.parse(target)
    let targets = []
    switch (event) {
      case 'add':
      case 'change':
        if (obj.name.startsWith('_')) {
          await new Promise(async function (resolve) {
            src(`${source.css}/**/!(_*).scss`)
              .pipe(through.obj(function (file, enc, callback) {
                const content = file.contents.toString().split(/\r?\n/).filter(i => i.startsWith('@import')).join('')
                if (content.includes(`${obj.name.substring(1)}'`) || content.includes(`${obj.name.substring(1)}"`)) {
                  targets.push(file.path)
                }
                return callback()
              }))
              .on('finish', resolve)
          })
        } else if (obj.ext === '.scss') {
          targets.push(path.join(__dirname, obj.dir, obj.base))
        }
        break;
      case 'unlink':
        const removedTarget = path.join(__dirname, target).replace(
          path.join(__dirname, source.css),
          path.join(__dirname, compiled.css),
        ).slice(0, -4) + 'css'
        fs.removeSync(removedTarget)
        fs.removeSync(removedTarget + '.map')
        fs.removeSync(removedTarget.slice(0, -3) + 'min.css')
        break;
    }
    filtered_css = targets
  })
  return watch(source.css, css)
}

/**
 * Adds vendor prefixes to CSS rules in all compiled CSS files that are not minified.
 *
 * This function uses the PostCSS tool with the Autoprefixer plugin to process CSS files,
 * ensuring compatibility across different browsers by adding necessary vendor prefixes.
 * The original CSS files are replaced with the prefixed versions, and source maps are created.
 *
 * @function css_prefix
 * @returns {Promise} A promise that resolves when the prefixing process is complete.
 */
function css_prefix() {
  return new Promise(async function (resolve) {
    await exec(`npx postcss ${compiled.css}/*.css !${compiled.css}/*.min.css --use autoprefixer --map --replace`).catch(err => console.log(err.stderr))
    resolve()
  })
}

/**
 * Minifies all compiled CSS files that are not already minified.
 *
 * This function reads CSS files from the compiled directory, processes them
 * using esbuild to minify the contents, renames the files with a '.min' suffix,
 * and saves the minified versions back to the compiled directory.
 *
 * @function css_minify
 * @returns {Stream} A stream that handles the minification process.
 */
function css_minify() {
  return src(`${compiled.css}/!(*.min).css`)
    .pipe(through.obj(function (file, enc, callback) {
      let content = file.contents.toString()
      content = esbuild.transformSync(content, {
        loader: 'css',
        minify: true,
      }).code
      file.contents = Buffer.from(content)
      this.push(file)
      return callback()
    }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest(compiled.css))
}

let filtered_js = []
/**
 * Processes JavaScript files from the source directory.
 *
 * This function reads all JavaScript files from the `source.js` directory,
 * concatenates them into a single file named `app.js`, and transforms the
 * contents using esbuild. The transformed content is then saved to the
 * `compiled.js` directory.
 *
 * @function js
 * @returns {Stream} A stream that handles the JavaScript processing.
 */
function js() {
  return src(`${source.js}/**/*.js`)
		.pipe(concat('app.js')) // Concatenate all JS files into one file
    .pipe(through.obj(function (file, enc, callback) {
      if (pass(file.path, filtered_js)) {
        let content   = file.contents.toString()
        content       = esbuild.transformSync(content).code
        file.contents = Buffer.from(content)
        this.push(file)
      }
      return callback()
    }))
    .pipe(dest(compiled.js))
}

/**
 * Watches all JavaScript files in `source.js` and recompiles them if they or
 * any of their dependencies change.
 *
 * If a file is added or changed, it will be compiled only if it's not a partial
 * (i.e., its name doesn't start with an underscore) or if any file that imports
 * it has changed.
 *
 * If a file is deleted, its compiled counterpart will also be deleted.
 *
 * @function js_watch
 * @returns {Function} A function that returns a promise that resolves when the
 * watch is set up.
 */
function js_watch() {
  watch(source.js).on('all', async function (event, target) {
    const obj = path.parse(target)
    let targets = []
    switch (event) {
      case 'add':
      case 'change':
        if (obj.ext === '.js') {
          targets.push(path.join(__dirname, obj.dir, obj.base))
        }
        break;
      case 'unlink':
        const removedTarget = path.join(__dirname, target).replace(
          path.join(__dirname, source.js),
          path.join(__dirname, compiled.js),
        )
        fs.removeSync(removedTarget)
        fs.removeSync(removedTarget.slice(0, -2) + 'min.js')
        break;
    }
    filtered_js = targets
  })
  return watch(source.js, js)
}

/**
 * Minifies all compiled JavaScript files that are not already minified.
 *
 * This function reads JavaScript files from the compiled directory, processes them
 * using esbuild to minify the contents, renames the files with a '.min' suffix,
 * and saves the minified versions back to the compiled directory.
 *
 * @function js_minify
 * @returns {Stream} A stream that handles the minification process.
 */
function js_minify() {
  //! return src(`${compiled.js}/!(*.min).js`)
  return src(`${compiled.js}/**/*.js`)
    .pipe(through.obj(function (file, enc, callback) {
      let content = file.contents.toString()
      content = esbuild.transformSync(content, {
        minify: true,
      }).code
      file.contents = Buffer.from(content)
      this.push(file)
      return callback()
    }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest(compiled.js))
}

/**
 * Determines if an item should be processed based on a filter.
 *
 * If the filter list `items` is empty, it allows all items to pass through.
 * Otherwise, it checks if the `item` is included in the `items` list to decide
 * whether the item should be processed.
 *
 * @param {string} item - The item to check against the filter list.
 * @param {Array<string>} items - The list of filter items to match against.
 * @returns {boolean} `true` if the item should be processed; `false` otherwise.
 */
function pass(item, items) {
  if (items.length === 0) {
    return true
  } else {
    return items.includes(item)
  }
}

exports.css        = css
exports.css_watch  = css_watch
exports.css_prefix = css_prefix
exports.css_minify = css_minify
exports.js         = js
exports.js_watch   = js_watch
exports.js_minify  = js_minify

exports.dev = parallel(css_watch, js_watch)
exports.build = series(
  clean,
	parallel(
    series(css, css_prefix, css_minify),
    series(js, js_minify),
  )
)