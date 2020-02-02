/**
 * tozan
 * https://github.com/paazmaya/tozan
 * Index filesystem by creating metadata database
 *
 * Copyright (c) Juga Paazmaya <paazmaya@yahoo.com> (https://paazmaya.fi)
 * Licensed under the MIT license
 */

declare namespace tozan {
  export interface TozanOptions {
    database?: string | false;
    hash?: string | false;
    ignoreDotFiles?: boolean | false;
  }
}

declare function tozan(directory: string, options?: tozan.TozanOptions): boolean;

export = tozan;
