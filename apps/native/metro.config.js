const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot)
const workspaceRoot = path.resolve(__dirname, '../../');
config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
    path.resolve(workspaceRoot, 'node_modules'), // 1순위: 모노레포 루트의 node_modules
    path.resolve(projectRoot, 'node_modules'),   // 2순위: 앱 내부의 node_modules
];
config.resolver.sourceExts.push('sql'); //drizzle setting
module.exports = withNativeWind(config, { input: './global.css', inlineRem: 16 })

