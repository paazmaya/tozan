/**
 * tozan
 * https://github.com/paazmaya/tozan
 * Index filesystem by creating metadata database
 *
 * Copyright (c) Juga Paazmaya <paazmaya@yahoo.com> (https://paazmaya.fi)
 * Licensed under the MIT license
 */

export = findFiles;
declare function findFiles(directory: string, options: {
    ignoreDotFiles: boolean;
}): any[];
declare namespace findFiles {
    export { canAccessFile as _canAccessFile };
}
declare function canAccessFile(item: string): boolean;
