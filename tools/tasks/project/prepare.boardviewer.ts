import { join } from 'path';

import Config from '../../config';


export = () => {
    let bower = require('gulp-bower');
    let path = join(
        Config.APP_SRC,
        'app/pages/editor/components/board-explorer/board-viewer');

    return bower({cwd: path, interactive: true});
};
