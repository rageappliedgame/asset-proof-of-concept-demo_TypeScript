/// <reference path="../RageAssetManager/AssetManager.ts"/>
/// <reference path="../RageAssetManager/BaseAsset.ts"/>
/// <reference path="../RageAssetManager/IAsset.ts"/>
/// <reference path="../RageAssetManager/IDataStorage.ts"/>
/// <reference path="../RageAssetManager/Messages.ts"/>
/// <reference path='../RageAssetManager/Dictionary.ts' />
/// <reference path="../RageAsset/IDataArchive.ts"/>
/// <reference path="../RageAsset/AssetSettings.ts"/>
///
module AssetPackage {

    // Setup Aliases.
    import AssetManager = AssetManagerPackage.AssetManager;
    import BaseAsset = AssetPackage.BaseAsset;
    import IAsset = AssetPackage.IAsset;
    import IDataStorage = AssetPackage.IDataStorage;
    import IDataArchive = AssetPackage.IDataArchive;
    import Logger = AssetPackage.Logger;
    import Messages = MessagesPackage.Messages;
    import Dictionary = AssetManagerPackage.Dictionary;
    import AssetSettings = AssetPackage.AssetSettings;

    /// <summary>
    /// Export the Asset.
    /// </summary>
    export class Asset extends BaseAsset {

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
        '  "Build":"3", ' +
        '  "Maturity":"Alpha", ' +
        '  "Dependencies": [ ' +
        '        { ' +
        '           "Class": "Logger", ' +
        '           "minVersion": "1.2.4", ' +
        '           "maxVersion": "1.*" ' +
        '        } ' +
        '   ] ' +
        '} ';

        private fData: string = "Hello Storage World";
        private fId1: string = "Hello1.txt";
        private fId2: string = "Hello2.txt";

        /// <summary>
        /// The file storage.
        /// </summary>
        private FileStorage: Dictionary = new Dictionary();

        /// <summary>
        /// The test subscription.
        /// </summary>
        private testSubscription = Messages.subscribe('Broadcast.Init', function (message: string, parameters: Object) {
            //"[" + this.Id + "]" + "." +
            //this.Id is undefined (this is the function and not the Asset).
            console.log(message + ": " + parameters);
        });

        /// <summary>
        /// Initializes a new instance of the Asset class. Sets the ClassName property.
        /// </summary>
        constructor() {
            super();

            // Somehow Settings cannot be applied here (so must be set in the calling program).
            // this.Settings = new AssetSettings();
        }

        /// <summary>
        /// Public method. Enumerates all available Loggers and uses them to emit the msg.
        /// </summary>
        ///
        /// <param name="msg"> The message. </param>
        public publicMethod(msg: string): void {
            // TODO Test Code.
            // 
            this.LoadSettings("tmp");

            // Log to the first registered Logger.
            // 
            var logger = this.assetManager.findAssetByClass("Logger");

            if (logger) {
                var l: Logger = <Logger>logger;

                l.log(l.Id + " - " + msg);
            }

            // Log to all registered Loggers.
            // 
            var loggers = (this.assetManager.findAssetsByClass("Logger"));

            if (loggers.length > 0) {
                for (var i = 0; i < loggers.length; i++) {
                    var l: Logger = <Logger>loggers[i];
                    l.log(l.Id + " - " + msg);
                }
            }
        }

        /// <summary>
        /// Executes the remove operation.
        /// </summary>
        public doArchive(): void {
            var ds: IDataArchive = this.getInterfaceMethod("Archive");

            if (ds) {
                ds.Archive(this.fId2);
            }
            else {
                this.FileStorage.remove(this.fId2);
            }
        }

        /// <summary>
        /// Executes the list operation.
        /// </summary>
        ///
        /// <returns>
        /// A List&lt;String&gt;
        /// </returns>
        public doList(): string[] {
            var ds: IDataStorage = this.getInterfaceMethod("Files");

            if (ds) {
                return ds.Files();
            }
            else {
                return this.FileStorage.keys;
            }
        }

        /// <summary>
        /// Executes the load operation.
        /// </summary>
        ///
        /// <param name="fn"> The filename. </param>
        ///
        /// <returns>
        /// A String.
        /// </returns>
        public doLoad(fn: string): string {
            var ds: IDataStorage = this.getInterfaceMethod("Load");

            if (ds) {
                return ds.Load(fn);
            } else {
                return this.FileStorage[fn];
            }
        }

        /// <summary>
        /// Executes the remove operation.
        /// </summary>
        public doRemove(): void {
            var ds: IDataStorage = this.getInterfaceMethod("Delete");

            if (ds) {
                ds.Delete(this.fId1);
            }
            else {
                this.FileStorage.remove(this.fId1);
            }
        }

        /// <summary>
        /// Executes the store operation.
        /// </summary>
        public doStore(): void {
            var ds: IDataStorage = this.getInterfaceMethod("Save");
            if (ds) {
                ds.Save(this.fId1, this.fData);
                ds.Save(this.fId2, this.fData);
            }
            else {
                this.FileStorage.add(this.fId1, this.fData);
                this.FileStorage.add(this.fId2, this.fData);
            }
        }
    }
}