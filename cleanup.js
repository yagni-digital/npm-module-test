
const fs = require('fs')
const path = require('path')
const styleSheetRegex = /(\s*)(<link .*href="\/public\/stylesheets\/hmrc-frontend\.css".*\/>)(\s*)/igm
const javaScriptRegex = /(\s*)(<script .*src="\/public\/javascripts\/hmrc-frontend\.js".*\>.*<\/script>)(\s*)/igm

const UTILS = require('./utils')
const parentPackageRoot = UTILS.getParentPackageRoot(process.env.INIT_CWD)

fs.unlinkSync(path.join(parentPackageRoot, 'public', 'stylesheets', 'hmrc-frontend.css'))
fs.unlinkSync(path.join(parentPackageRoot, 'public', 'javascripts', 'hmrc-frontend.js'))

var headHTMLFragment = fs.readFileSync(path.join(parentPackageRoot, 'app', 'views', 'includes', 'head.html')).toString()
headHTMLFragment = headHTMLFragment.replace(styleSheetRegex, '')
fs.writeFileSync(path.join(parentPackageRoot, 'app', 'views', 'includes', 'head.html'), headHTMLFragment)

var scriptsHTMLFragment = fs.readFileSync(path.join(parentPackageRoot, 'app', 'views', 'includes', 'scripts.html')).toString()
scriptsHTMLFragment = scriptsHTMLFragment.replace(javaScriptRegex, '')
fs.writeFileSync(path.join(parentPackageRoot, 'app', 'views', 'includes', 'scripts.html'), scriptsHTMLFragment)
