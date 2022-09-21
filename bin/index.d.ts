declare function run({ serveScript, url, timeout, configFilePath, }: {
    serveScript: string;
    url: string;
    timeout: number;
    configFilePath?: string;
}): void;
export { run };
