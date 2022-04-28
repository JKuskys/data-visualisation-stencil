import { angularOutputTarget } from '@stencil/angular-output-target';
import { reactOutputTarget } from '@stencil/react-output-target';
import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'data-visualiation-system-stencil',
  outputTargets: [
    angularOutputTarget({
      componentCorePackage: 'data-visualisation-system-stencil-angular',
      directivesProxyFile: '../angular-workspace/projects/component-library/src/lib/stencil-generated/components.ts',
      directivesArrayFile: '../angular-workspace/projects/component-library/src/lib/stencil-generated/index.ts',
    }),
    reactOutputTarget({
      componentCorePackage: 'data-visualisation-system-stencil-react',
      proxiesFile: '../your-react-library-name/src/components/stencil-generated/index.ts',
      includeDefineCustomElements: true,
    }),
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements',
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
  ],
};
