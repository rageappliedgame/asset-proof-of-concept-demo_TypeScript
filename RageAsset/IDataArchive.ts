module AssetPackage {

    /// <summary>
    /// Interface for logger.
    /// </summary>
    export interface IDataArchive {

        /// <summary>
        /// Archives the given file.
        /// </summary>
        ///
        /// <param name="fileId"> The file identifier to delete. </param>
        ///
        /// <returns>
        /// true if it succeeds, false if it fails.
        /// </returns>
        Archive(fileId: string) : boolean;
    }
}