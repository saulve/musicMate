const dotenv = require( "dotenv" );
const webpack = require( "webpack" );
const merge = require( "webpack-merge" );
const UglifyJsPlugin = require( "uglifyjs-webpack-plugin" );
const CopyWebpackPlugin = require( "copy-webpack-plugin" );
const Dotenv = require( "dotenv-webpack" );
const path = require( "path" );
const common = require( "./webpack.common.js" );
const { version } = require( "../package.json" );

// Load the environment vars first
dotenv.config({
  path: path.resolve( __dirname, "../env/.env.prod" )
});

const prodPermissions = `${process.env.BUILD_API_URL}/*`;

module.exports = merge( common, {
  mode: "production",
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: {
            warnings: false,
            drop_debugger: true,
            drop_console: true
          }
        }
      })
    ]
  },
  plugins: [
    new CopyWebpackPlugin( [
      {
        from: "manifest.json",
        to: "manifest.json",
        transform: content => {
          const jsonContent = JSON.parse( content );
          jsonContent.version = version;
          jsonContent.permissions.push( prodPermissions );

          return JSON.stringify( jsonContent, null, 2 );
        }
      }
    ] ),
    new Dotenv({
      path: path.resolve( __dirname, "../env/.env.prod" )
    })
  ]
});
