const fs = require('fs')
const path = require('path')
const http = require('http');
const styleSheetRegex = /(<link .*href="\/public\/stylesheets\/hmrc-frontend\.css".*\/>)/im
const UTILS = require('./utils')
const parentPackageRoot = UTILS.getParentPackageRoot(process.env.INIT_CWD || __dirname)

const Promise = require('bluebird')
const version = require(path.join(__dirname, 'package.json')).version
const assetServer = 'http://localhost'

const download = function (url, dest) {
  console.info('downloading', [url, dest].join(' -> '))
  return new Promise(function (res, rej) {
    function cb(err) {
      err ? rej(err) : res()
    }
    var file = fs.createWriteStream(dest)
    http.get(url, function (response) {
      response.pipe(file)
      file.on('finish', function () {
        file.close(cb)
      })
    }).on('error', function (err) { // Handle errors
      fs.unlink(dest, function (){
        cb(err.message)
      })
    })
  })
}

function retreiveBuiltFile(partialUrlParts, partialFilePathParts) {
  download(
    [assetServer, 'assets', version].concat(partialUrlParts).join('/'),
    path.join.apply(path, [parentPackageRoot].concat(partialFilePathParts))
  )
}

Promise.all([
  retreiveBuiltFile(['stylesheets', 'application.min.css'], ['public', 'stylesheets', 'hmrc-frontend.css']),
  retreiveBuiltFile(['javascripts', 'application.min.js'], ['app', 'assets', 'javascripts', 'hmrc-frontend.js'])
])
  .then(_ => {
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
  })
