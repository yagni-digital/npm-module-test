const fs = require('fs')
const path = require('path')
const styleSheetRegex = /(<link .*href="\/public\/stylesheets\/hmrc-frontend\.css".*\/>)/im
const UTILS = require('./utils')
const parentPackageRoot = UTILS.getParentPackageRoot(process.env.INIT_CWD)

console.log('copy:', [
  path.join(__dirname, 'public', 'stylesheets', 'hmrc-frontend.css'),
  path.join(parentPackageRoot, 'public', 'stylesheets', 'hmrc-frontend.css')
].join(' -> '))
//
// fs.copyFileSync(
//   path.join(__dirname, 'public', 'stylesheets', 'hmrc-frontend.css'),
//   path.join(parentPackageRoot, 'public', 'stylesheets', 'hmrc-frontend.css')
// )
//
// fs.copyFileSync(
//   path.join(__dirname, 'public', 'javascripts', 'hmrc-frontend.js'),
//   path.join(parentPackageRoot, 'public', 'javascripts', 'hmrc-frontend.js')
// )

var headHTMLFragment = fs.readFileSync(path.join(parentPackageRoot, 'app', 'views', 'includes', 'head.html')).toString()
if (headHTMLFragment.match(styleSheetRegex)) {
  console.log('Found stylesheet with regex')
} else {
  console.log('Stylesheet not found')

  fs.appendFileSync(
    parentPackageRoot + '/app/views/includes/head.html',
    '\n<link href="/public/stylesheets/hmrc-frontend.css" media="screen" rel="stylesheet" type="text/css" />\n'
  )
}

fs.appendFileSync(
  parentPackageRoot + '/app/views/includes/scripts.html',
  '\n<script src="/public/javascripts/hmrc-frontend.js"></script>'
)

console.log('Configured prototype to use the module')
