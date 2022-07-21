import { join } from 'path';
import nodeExternals from 'webpack-node-externals';
import tsConfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import { getNodeEnv } from './src/config/env';
const config = {
    entry: [
        './src/index.ts'
    ],
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                options: {
                    presets: ['@babel/preset-env'],
                    rootMode: "upward"
                }
            }
        ]
    },
    optimization: {
        nodeEnv: false
    },
    mode: getNodeEnv() === 'production' ? 'production' : 'development',
    target: 'node',
    externals: [nodeExternals()],
    devtool: 'source-map',
    resolve: {
        extensions: ['.ts', 'js'],
        plugins: [new tsConfigPathsPlugin({})]
    },
    output: {
        libraryTarget: 'commonjs2',
        path: join(__dirname, 'dist'),
        filename: 'main.js'
    }
};

module.exports = (env, argv) => {
    const { mode } = argv;
    config.mode = mode;
    if (mode === 'development') {
        config.devtool = 'source-map';
    }
    return config;
}