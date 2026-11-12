const { getDefaultConfig } = require('expo/metro-config')
const path = require('path')

const projectRoot = __dirname
const config = getDefaultConfig(projectRoot)

config.watchFolders = [path.resolve(projectRoot, '../shared')]

const previous = config.resolver.resolveRequest
config.resolver.resolveRequest = (context, moduleName, platform) => {
  const rewritten = moduleName.endsWith('.ts') ? moduleName.slice(0, -3) : moduleName
  if (previous) {
    return previous(context, rewritten, platform)
  }
  return context.resolveRequest(context, rewritten, platform)
}

module.exports = config
