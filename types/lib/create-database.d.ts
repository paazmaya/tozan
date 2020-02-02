/**
 * tozan
 * https://github.com/paazmaya/tozan
 * Index filesystem by creating metadata database
 *
 * Copyright (c) Juga Paazmaya <paazmaya@yahoo.com> (https://paazmaya.fi)
 * Licensed under the MIT license
 */

export = createDatabase;
declare function createDatabase(location: string): any;
declare namespace createDatabase {
    export { migrateDatabase as _migrateDatabase };
}
declare function migrateDatabase(db: any): boolean;
