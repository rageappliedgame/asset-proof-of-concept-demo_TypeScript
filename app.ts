/// <reference path="RageAssetManager/AssetManager.ts"/>
/// <reference path="RageAssetManager/Messages.ts"/>
/// 
/// <reference path="RageAsset/Asset.ts"/>
/// <reference path="RageAsset/AssetSettings.ts"/>
/// <reference path="RageAsset/Logger.ts"/>
/// 
/// <reference path="Bridge.ts"/>
///
module MyNameSpace {
    // Import and alias the Asset*.
    // 
    import AssetManager = AssetManagerPackage.AssetManager;
    import BaseAsset = AssetPackage.BaseAsset;
    import Dependency = AssetPackage.Dependency;

    import Asset = AssetPackage.Asset;
    import AssetSettings = AssetPackage.AssetSettings;
    import Logger = AssetPackage.Logger;

    import Messages = MessagesPackage.Messages;

    //class Greeter {
    //    element: HTMLElement;
    //    span: HTMLElement;
    //    timerToken: number;

    //    constructor(element: HTMLElement) {
    //        this.element = element;
    //        this.element.innerHTML += "The time is: ";
    //        this.span = document.createElement('span');
    //        this.element.appendChild(this.span);
    //        this.span.innerText = new Date().toUTCString();
    //    }

    //    start() {
    //        this.timerToken = setInterval(() => this.span.innerHTML = new Date().toUTCString(), 500);
    //    }

    //    stop() {
    //        clearTimeout(this.timerToken);
    //    }

    //    private someproperty: string = "some value";

    //    public get someProperty(): string {
    //        return this.someproperty;
    //    }
    //}
    window.onload = () => {
        Tests.Test_01_Setup();

        Tests.Test_02_VersionAndDependenciesReport();

        Tests.Test_03_AssetToAssetAndBridge();

        Tests.Test_04_DataStorageAndArchive();

        Tests.Test_05_Broadcasting();

        Tests.Test_06_SanityChecks();

        Tests.Test_07_Settings();
    }

    var bridge1: Bridge = new Bridge();
    var bridge2: Bridge = new Bridge();

    export class Tests {
        private static asset1: Asset;
        private static asset2: Asset;
        private static asset3: Logger;
        private static asset4: Logger;

        /// <summary>
        /// Tests 01 setup.
        /// </summary>
        public static Test_01_Setup(): void {
            AssetManager.Instance.Bridge = bridge2;

            //! Add assets (Asset Manager is already created in order to add a bridge to see registration output).
            //
            this.asset1 = new Asset();
            this.asset2 = new Asset();
            this.asset3 = new Logger();
            this.asset4 = new Logger();

            //this.asset5 = new DialogueAsset();

            // Give asset2 it's own bridge.
            this.asset3.Bridge = bridge2;

            this.asset3.log("Asset1: " + this.asset1.Class + ", " + this.asset1.Id);
            this.asset3.log("Asset2: " + this.asset2.Class + ", " + this.asset2.Id);
            this.asset3.log("Asset3: " + this.asset3.Class + ", " + this.asset3.Id);
            this.asset3.log("Asset4: " + this.asset4.Class + ", " + this.asset4.Id);
            //this.asset3.log("Asset5: " + this.asset5.Class + ", " + this.asset5.Id);
        }

        /// <summary>
        /// Tests 02 version and dependencies report.
        /// </summary>
        public static Test_02_VersionAndDependenciesReport(): void {
            //! See https://msdn.microsoft.com/en-us/library/system.version(v=vs.110).aspx

            //! major.minor[.build[.revision]]
            //!
            //! The components are used by convention as follows:
            //!
            //! Major:    Assemblies with the same name but different major versions are not interchangeable.
            //!           A higher version number might indicate a major rewrite of a product where backward
            //!           compatibility cannot be assumed.
            //! Minor:    If the name and major version number on two assemblies are the same,
            //!           but the minor version number is different, this indicates significant enhancement with
            //!           the intention of backward compatibility.
            //!           This higher minor version number might indicate a point
            //!           release of a product or a fully backward-compatible new version of a product.
            //! Build:    A difference in build number represents a recompilation of the same source.
            //!           Different build numbers might be used when the processor, platform, or compiler changes.
            //! Revision: Assemblies with the same name, major, and minor version numbers but different revisions
            //!           are intended to be fully interchangeable. A higher revision number might be used in a
            //!           build that fixes a security hole in a previously released assembly.
            //!
            //! For two versions to be equal, the major, minor, build, and revision numbers of the first Version
            //! object must be identical to those of the second Version object. If the build or revision number
            //! of a Version object is undefined, that Version object is considered to be earlier than a Version
            //! object whose build or revision number is equal to zero. The following example illustrates this
            //! by comparing three Version objects that have undefined version components.

            this.asset3.log("");
            this.asset3.log("Asset " + this.asset1.Class + " v" + this.asset1.Version);

            for (var j = 0; j < this.asset1.Dependencies.length; j++) {
                var dependency: Dependency = this.asset1.Dependencies[j];

                this.asset3.log("Depends on " + dependency.Class + " v" + dependency.versionRange);
            }
            this.asset3.log("");

            this.asset3.log(AssetManager.Instance.VersionAndDependenciesReport);

            this.asset3.log("Version: v" + this.asset1.Version);
            this.asset3.log("");
        }

        /// <summary>
        /// Tests 03 asset to asset and bridge.
        /// </summary>
        public static Test_03_AssetToAssetAndBridge(): void {

            // Use the new Logger directly.
            //
            this.asset3.log("LogByLogger: " + this.asset3.Class + ", " + this.asset3.Id);

            // Test if asset1 can find the Logger (asset3) thru the AssetManager.
            //
            this.asset1.publicMethod("Hello World (console.log)");

            // Replace the both Logger's log method by a native version supplied by the Game Engine.
            // 
            AssetManager.Instance.Bridge = bridge1;

            // Check the results for both Loggers differ (one message goes to the console, the other shows as an alert).
            //
            this.asset1.publicMethod("Hello Different World (Game Engine Logging)");

            // Replace the 1st Logger's log method by a native version supplied by the Game Engine. 
            // 
            this.asset3.Bridge = bridge2;

            // Check the results for both Loggers differ (one message goes to the console, the other shows as an alert). 
            // 
            this.asset1.publicMethod("Hello Different World (Game Engine Logging)");
        }

        /// <summary>
        /// Tests 04 data storage and archive.
        /// </summary>
        public static Test_04_DataStorageAndArchive(): void {
            // 1) Lets use the Asetmanage Bridge (using a localStorage based implementation).

            this.asset3.log("----[assetmanager.bridge]-----");
            this.asset2.doStore();   // Create Hello1.txt and Hello2.txt

            var files: string[];

            files = this.asset2.doList();
            for (var j = 0; j < files.length; j++) {
                this.asset3.log(files[j] + "=" + this.asset2.doLoad(files[j]));
            }

            this.asset2.doRemove();  // Remove Hello1.txt

            files = this.asset2.doList();
            for (var j = 0; j < files.length; j++) {
                this.asset3.log(files[j] + "=" + this.asset2.doLoad(files[j]));
            }

            this.asset2.doArchive(); // Move Hello2.txt

            // 2) Reset/Remove Both Bridges (back to an in-memory Dictionary of Asset).
            // 
            this.asset3.log("----[default]-----");

            this.asset2.Bridge = null;
            AssetManager.Instance.Bridge = null;

            files = this.asset2.doList();
            for (var j = 0; j < files.length; j++) {
                this.asset3.log(files[j] + "=" + this.asset2.doLoad(files[j]));
            }
            this.asset2.doStore();

            this.asset3.log("----[private.bridge]-----");

            // 3) Use a bridge on the Asset (using a localStorage based implementation).
            // 
            this.asset2.Bridge = bridge2;

            this.asset2.doStore();

            files = this.asset2.doList();
            for (var j = 0; j < files.length; j++) {
                this.asset3.log(files[j] + "=" + this.asset2.doLoad(files[j]));
            }

            // 4) Reset Asset Bridge (back to an in-memory Dictionary of Asset).
            // 
            this.asset3.log("----[default]-----");

            this.asset2.Bridge = null;

            files = this.asset2.doList();
            for (var j = 0; j < files.length; j++) {
                this.asset3.log(files[j] + "=" + this.asset2.doLoad(files[j]));
            }

            // 5) Reattach AssetManager Bridge for logging purposes.
            //
            AssetManager.Instance.Bridge = bridge2;
        }

        /// <summary>
        /// Tests 05 Message broadcasting.
        /// </summary>
        public static Test_05_Broadcasting(): void {
            // Define an broadcast message, subscribe to it and broadcast the message
            // and unsubscribe. 
            //
            Messages.define('Broadcast.Msg');

            var subscriptionId = Messages.subscribe('Broadcast.Msg', (message: string, parameters: Object): void => {
                this.asset3.log("[demo.html]" + "." + message + ": " + parameters);
            });

            Messages.broadcast('Broadcast.Msg', 'hello from demo.html!');

            // Can't directly unsubscribe like in C# as setTimeOut has still to happen.
            // 
            // Messages.unsubscribe(subscriptionId);
        }

        /// <summary>
        /// Tests 06 sanity checks.
        /// </summary>
        public static Test_06_SanityChecks(): void {
            // Check if id and class can still be changed (shouldn't).
            //
            //logger.Class = "XYYZ";
            //this.asset3.log(logger.Class);

            //logger.Id = "123";
            //this.asset3.log(logger.Id);

            // Check if id and class can still be changed (shouldn't).
            //
            this.asset4.Id = "XYY1Z";
            this.asset4.Class = "test";
            this.asset4.log("Asset4: " + this.asset4.Class + ", " + this.asset4.Id);

            // Test if we can reregister without creating new stuff in the register (ie get the existing unique id returned).
            // 

            this.asset3.log("Trying to re-register " + this.asset4.Id + " -> " + AssetManager.Instance.registerAssetInstance(this.asset4, this.asset4.Class));

            //console.log(asset3.Class);
            //console.log(asset3.Id);
        }

        public static Test_07_Settings(): void {
            /* TO BE PORTED
            //script.dialogueText.text = asset1.DefaultSettings.Count.ToString();/ / ["NewKey0"].;
            */

            // If ommitted, hasSettings will return false and no settings will be loaded.
            // Note: If the settings are supplied by the Bridge using IDefaultSettings,
            //       initialising the Settings property with new Object() is also allowed.
            this.asset1.Settings = new AssetSettings(42);
            this.asset2.Settings = new AssetSettings(43);
            // this.asset2.Settings = new Object();

            //! Log Default Settings
            this.asset3.log(this.asset1.SettingsToJson());

            //! Log Default Settings
            this.asset2.Bridge = bridge1;
            this.asset3.log(this.asset2.SettingsToJson());

            //! Save App Default Settings if not present (and Settings is not null).
            //! Note: this will replace the previously applied settings a few line up.
            this.asset2.SaveDefaultSettings(false);

            //! Load App Default Settings if present (and Settings is not null).
            this.asset2.LoadDefaultSettings();
            this.asset3.log(this.asset2.SettingsToJson());

            //! Try Saving an Asset with No Settings (null)
            if (this.asset3.hasSettings) {
                this.asset3.SaveDefaultSettings(false);

                this.asset3.log(this.asset3.SettingsToJson());
            }

            //! Save Runtime Settings
            this.asset2.SaveSettings("runtime-settings.json");

            //! Load Runtime Settings.
            this.asset1.Bridge = bridge1;
            this.asset1.LoadSettings("runtime-settings.json");

            this.asset3.log(this.asset1.SettingsToJson());
        }
    }
}