const dotenv = require( "dotenv" );
const webpack = require( "webpack" );
const merge = require( "webpack-merge" );
const ChromeExtensionReloader = require( "webpack-chrome-extension-reloader" );
const CopyWebpackPlugin = require( "copy-webpack-plugin" );
const Dotenv = require( "dotenv-webpack" );
const path = require( "path" );
const common = require( "./webpack.common.js" );
const { version } = require( "../package.json" );

// Load the environment vars first
dotenv.config({
  path: path.resolve( __dirname, "../env/.env.dev" )
});

const devPermissions = "http://localhost/*";

module.exports = merge( common, {
  mode: "development",
  devtool: "inline-source-map",
  plugins: [
    new ChromeExtensionReloader(),
    new CopyWebpackPlugin( [
      {
        from: "manifest.json",
        to: "manifest.json",
        transform: content => {
          const jsonContent = JSON.parse( content );
          jsonContent.version = version;
          jsonContent.permissions.push( devPermissions );

          return JSON.stringify( jsonContent, null, 2 );
        }
      }
    ] ),
    new Dotenv({
      path: path.resolve( __dirname, "../env/.env.dev" )
    })
  ]
});
