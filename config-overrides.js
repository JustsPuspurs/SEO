const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = function override(config, env) {
    config.plugins = config.plugins.map(plugin => {
        if (plugin.constructor.name === 'HtmlWebpackPlugin') {
            plugin.options.template = path.resolve(__dirname, 'index.html');
            console.log('Updated HtmlWebpackPlugin template path:', plugin.options.template);  // Ensure this logs
        }
        return plugin;
    });
    console.log('Plugins after update:', JSON.stringify(config.plugins, null, 2));  // Log to check all plugins
    return config;
};
