const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot);

// Monorepo: cari modules di mitra-expo dulu, baru root
const workspaceRoot = path.resolve(projectRoot, '../..');
config.watchFolders = [projectRoot];

config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// Paksa React & React Native instance tunggal (hindari duplikat 18 vs 19)
config.resolver.extraNodeModules = {
  react: path.resolve(projectRoot, 'node_modules/react'),
  'react-native': path.resolve(workspaceRoot, 'node_modules/react-native'),
};

// Jangan naik hierarki cari modules lain (cegah ketarik React 18 root)
config.resolver.disableHierarchicalLookup = true;

module.exports = config;
