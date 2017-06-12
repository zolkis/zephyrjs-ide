import { argv } from 'yargs';
import { join } from 'path';

import { SeedConfig } from './seed.config';
import { ExtendPackages } from './seed.config.interfaces';


/**
 * This class extends the basic seed configuration, allowing for project specific overrides. A few examples can be found
 * below.
 */
export class ProjectConfig extends SeedConfig {
  APP_TITLE_HTML: string = '';
  APP_SHORT_DESC: string = '';
  APP_SHORT_DESC_HTML: string = '';

  PROJECT_TASKS_DIR = join(process.cwd(), this.TOOLS_DIR, 'tasks', 'project');
  GIT_REV: string = '';

  // Bootstrap's glyphicons and FontAwesome expect fonts to be in `../fonts`
  // as a path that's relative to the CSS file, so we need to copy them.
  FONTS_DEST = `${this.APP_DEST}/fonts`;
  FONTS_SRC = [
      'node_modules/bootstrap/dist/fonts/**',
      'node_modules/font-awesome/fonts/**'
  ];

  // Monaco must be copied to the deployed up because it needs to be loaded
  // lazily.
  MONACO_DEST = `${this.APP_DEST}/libs/monaco`;
  MONACO_SRC = ['node_modules/monaco-editor/min/**/*'];

  constructor() {
    super();
    this.APP_TITLE = 'JS IDE for Zephyr OS';
    this.APP_TITLE_HTML = 'JS <strong>IDE</strong> for Zephyr OS';
    this.APP_SHORT_DESC = 'JavaScript Web IDE for Zephyr OS';
    this.APP_SHORT_DESC_HTML = 'JavaScript <strong>Web IDE</strong> for Zephyr OS';

    this.PORT = argv['port'] || 8000;
    this.GIT_REV = this.getGitRev();
    // this.GOOGLE_ANALYTICS_ID = 'Your site's ID';

    /* Enable typeless compiler runs (faster) between typed compiler runs. */
    // this.TYPED_COMPILE_INTERVAL = 5;

    // Add `NPM` third-party libraries to be injected/bundled.
    this.NPM_DEPENDENCIES = [
      ...this.NPM_DEPENDENCIES,
      {src: 'jquery/dist/jquery.min.js', inject: 'libs'},
      {src: 'bootstrap/dist/js/bootstrap.min.js', inject: 'libs'},
      {src: 'bootstrap-toggle/js/bootstrap-toggle.min.js', inject: 'libs'},
      {src: 'requirejs/require.js', inject: 'libs'},

      {src: 'bootstrap/dist/css/bootstrap.min.css', inject: true}, // `true` injects into the css section
      {src: 'bootstrap/dist/css/bootstrap-theme.min.css', inject: true},
      {src: 'font-awesome/css/font-awesome.min.css', inject: true},
      {src: 'bootstrap-toggle/css/bootstrap-toggle.min.css', inject: true}
    ];

    // Add `local` third-party libraries to be injected/bundled.
    this.APP_ASSETS = [
      ...this.APP_ASSETS,
      // {src: `${this.APP_SRC}/your-path-to-lib/libs/jquery-ui.js`, inject: true, vendor: false}
      // {src: `${this.CSS_SRC}/path-to-lib/test-lib.css`, inject: true, vendor: false},
      {src: `${this.APP_SRC}/app/shared/webusb/ihex.js`, inject: true, vendor: false}
    ];

    this.ROLLUP_INCLUDE_DIR = [
      ...this.ROLLUP_INCLUDE_DIR,
      //'node_modules/moment/**'
    ];

    this.ROLLUP_NAMED_EXPORTS = [
      ...this.ROLLUP_NAMED_EXPORTS,
      //{'node_modules/immutable/dist/immutable.js': [ 'Map' ]},
    ];

    // Add packages (e.g. ng2-translate)
    // let additionalPackages: ExtendPackages[] = [{
    //   name: 'ng2-translate',
    //   // Path to the package's bundle
    //   path: 'node_modules/ng2-translate/bundles/ng2-translate.umd.js'
    // }];
    //
    // this.addPackagesBundles(additionalPackages);

    let additionalPackages: ExtendPackages[] = [
        {
            name: 'ngx-resource',
            path: 'node_modules/ngx-resource/bundles/ngx-resource.umd.js'
        },
        {
            name: 'angular2-fontawesome',
            path: 'node_modules/angular2-fontawesome/bundles/angular2-fontawesome.umd.js'
        },
        {
            name: 'angular2-notifications',
            path: 'node_modules/angular2-notifications/components.js'
        },
        {
            name: 'ng2-split-pane',
            path: 'node_modules/ng2-split-pane/lib/ng2-split-pane.js'
        },
        {
            name: 'ng-sidebar',
            path: 'node_modules/ng-sidebar/lib/index.js'
        },
        {
            name: 'angular-2-local-storage',
            path: 'node_modules/angular-2-local-storage/dist/index.js'
        },
        {
            name: 'hterm-umdjs',
            path: 'node_modules/hterm-umdjs/dist/index.js'
        },
        {
            name: 'rxjs',
            path: 'node_modules/rxjs'
        },
        {
            name: 'ng-inline-svg',
            path: 'node_modules/ng-inline-svg/lib/index.js'
        },
        {
            name:'angular2-markdown',
            path:'node_modules/angular2-markdown/bundles/angular2-markdown.umd.min.js'
        }
    ];

    this.SYSTEM_CONFIG_DEV.packages[''] = {
        defaultExtension: 'js'
    };

    this.addPackagesBundles(additionalPackages);

    /* Add proxy middleware */
    // this.PROXY_MIDDLEWARE = [
    //   require('http-proxy-middleware')('/api', { ws: false, target: 'http://localhost:3003' })
    // ];

    /* Add to or override NPM module configurations: */
    // this.PLUGIN_CONFIGS['browser-sync'] = { ghostMode: false };

    this.ENABLE_SCSS = true;
  }

  getGitRev() {
      let exec = require('sync-exec');
      let stdout = exec('git rev-parse --short HEAD').stdout;
      let rev = stdout.split('\n')[0];

      return rev;
  }
}
