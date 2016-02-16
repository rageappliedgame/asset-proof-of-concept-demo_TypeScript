/// <reference path="../RageAssetManager/ISettings.ts"/>
///
module AssetPackage {

    import ISettings = AssetPackage.ISettings;

    /// <summary>
    /// An asset settings.
    /// </summary>
    export class AssetSettings implements ISettings {

        private _value: number = 0;

        /// <summary>
        /// Initializes a new instance of the AssetSettings class.
        /// </summary>
        ///
        /// <param name="value"> The value. </param>
        constructor(value: number) {
            this._value = value;
        }

        /// <summary>
        /// The answer to all.
        /// </summary>
        ///
        /// <returns>
        /// A number.
        /// </returns>
        public get TheAnswerToAll(): number {
            return this._value;
        }
    }
}

