import * as gulp from 'gulp';
import { join } from 'path';

import Config from '../../config';

export = () => {
    let path = 'app/pages/editor/components/board-explorer/board-viewer',
        src: string = join(Config.APP_SRC, path, '**/*.html'),
        dest: string = join(Config.APP_DEST, path);

    return gulp.src(src).pipe(gulp.dest(dest));
};
