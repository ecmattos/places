import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';

const DB_NAME: string = '__ionic2storage';
const win: any = window;

@Injectable()
export class PlaceProvider {
    private _db: any;

    constructor(public platform: Platform) {
        this.platform.ready().then(() => {
            if (win.sqlitePlugin) {
                this._db = win.sqlitePlugin.openDatabase({
                    name: DB_NAME,
                    location: 2,
                    createFromLocation: 0
                });
            } else {
                console.warn('SQLite plugin not installed, falling back to WebSQL.');
                this._db = win.openDatabase(DB_NAME, '1.0', 'database', 5 * 1024 * 1024);
            }
            this._tryInit();
        });
    }

    /** Initialize the DB with our required tables */
    _tryInit() {
        this.query('CREATE TABLE IF NOT EXISTS places (id INTEGER PRIMARY KEY AUTOINCREMENT, description TEXT, address TEXT)')
        .catch(err => {
            console.error('Unable to create initial storage tables', err.tx, err.err);
        });
    }

    /**
     * Perform an arbitrary SQL operation on the database. Use this method
     * to have full control over the underlying database through SQL operations
     * like SELECT, INSERT, and UPDATE.
     *
     * @param {string} query the query to run
     * @param {array} params the additional params to use for query placeholders
     * @return {Promise} that resolves or rejects with an object of the form 
     * { tx: Transaction, res: Result (or err)}
     */
    query(query: string, params: any[] = []): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                this._db.transaction((tx: any) => {
                        tx.executeSql(query, params,
                            (tx: any, res: any) => resolve({ tx: tx, res: res }),
                            (tx: any, err: any) => reject({ tx: tx, err: err }));
                    },
                    (err: any) => reject({ err: err }));
            } catch (err) {
                reject({ err: err });
            }
        });
    }

    /** GET the value in the database identified by the given key. */
    get(key: string): Promise<any> {
        return this.query('select key, value from places where key = ? limit 1', [key])
        .then(data => {
            if (data.res.rows.length > 0) {
                return data.res.rows.item(0).value;
            }
        });
    }

    /** SET the value in the database for the given key. */
    set(key: string, value: string): Promise<any> {
        return this.query('insert into places(key, value) values (?, ?)', [key, value]);
    }

    /** REMOVE the value in the database for the given key. */
    remove(key: string): Promise<any> {
        return this.query('delete from places where key = ?', [key]);
    }
}
