module AssetPackage {

    /// <summary>
    /// Interface for logger.
    /// </summary>
    export interface ILogger {

        /// <summary>
        /// The prefix.
        /// </summary>
        prefix: string;

        /// <summary>
        /// Executes the log operation.
        /// 
        /// Implement this in Game Engine Code.
        /// </summary>
        ///
        /// <param name="msg"> The message. </param>
        doLog(msg: string) : void;
    }
}