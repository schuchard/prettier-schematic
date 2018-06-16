import { get } from 'http';

export interface NpmRegistryPackage {
  name: string;
  version: string;
}

export function getLatestNodeVersion(packageName: string): Promise<NpmRegistryPackage> {
  const DEFAULT_VERSION = 'latest';

  return new Promise((resolve) => {
    return get(`http://registry.npmjs.org/${packageName}/latest`, (res) => {
      let rawData = '';
      res.on('data', (chunk) => (rawData += chunk));
      res.on('end', () => {
        try {
          const { name, version } = JSON.parse(rawData);
          resolve(buildPackage(name, version));
        } catch (e) {
          resolve(buildPackage(name));
        }
      });
    }).on('error', () => resolve(buildPackage(name)));
  });

  function buildPackage(name: string, version: string = DEFAULT_VERSION): NpmRegistryPackage {
    return { name, version };
  }
}
