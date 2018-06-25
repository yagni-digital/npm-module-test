// ToDo: Crossplatform path handling
exports.getParentPackageRoot = function getParentPackageRoot (startPath) {
  const fs = require('fs')
  const path = require('path')

  if (fs.existsSync(path.join(startPath, 'package.json'))) {
    return startPath
  } else {
    // this might be unecessary
    if (startPath === '' || startPath === path.sep) throw new Error('no package.json file found')
    return getParentPackageRoot(startPath.split(path.sep).slice(0, -1).join(path.sep))
    //
  }
}
