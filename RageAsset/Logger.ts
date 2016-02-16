/// <reference path="../RageAssetManager/BaseAsset.ts"/>
/// <reference path="../RageAssetManager/IAsset.ts"/>
/// 
/// <reference path="ILogger.ts"/>
///
module AssetPackage {

    import BaseAsset = AssetPackage.BaseAsset;

    /// <summary>
    /// Export the Asset.
    /// </summary>
    export class Logger extends BaseAsset {

        /// <summary>
        /// Information describing the protected version.
        /// </summary>
        ///
        /// <remarks>
        /// Commas after the last member and \r\n are not allowed.
        /// </remarks>
        protected versionInfo: string =
        '{ ' +
        '  "Major":"1", ' +
        '  "Minor":"2", ' +
        '  "Build":"5", ' +
        '  "Maturity":"Beta" ' +
        '} ';

        /// <summary>
        /// Initializes a new instance of the logger class.
        /// </summary>
        constructor() {
            super();
        }
        
        /// <summary>
        /// Logs. We need some funky typecasting to get things compiling as our Bridge does not implement
        /// ILogger.
        /// </summary>
        ///
        /// <param name="msg"> The message. </param>
        log(msg: string): void {
            if (this.Bridge && (<ILogger>this.Bridge).doLog) {
                // Force a cast. There is no 'is' operator and 'instanceof' does not compile.
                (<ILogger>this.Bridge).doLog(msg);
            } else if (this.assetManager.Bridge && (<ILogger>this.assetManager.Bridge).doLog) {
                // Force a cast. There is no 'is' operator and 'instanceof' does not compile.
                (<ILogger>this.assetManager.Bridge).doLog(msg);
            } else if (console && console.log) {
                console.log(msg);
            }
        }
    }
}