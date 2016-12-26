import { Injectable } from '@angular/core';

const DB_NAME: string = '__ionic2storage';
const win: any = window;

@Injectable()
export class PlaceProvider {
    
    private db: any;
    places: any[];

    constructor() {
        if (win.sqlitePlugin) {
            this.db = win.sqlitePlugin.openDatabase({
                name: DB_NAME,
                location: 2,
                createFromLocation: 0
            });
        } else {
            console.warn('SQLite plugin not installed, falling back to WebSQL.');
            this.db = win.openDatabase(DB_NAME, '1.0', 'database', 5 * 1024 * 1024);
        }
        
        this.tryInit();
    }

    /** Initialize the DB with our required tables */
    tryInit() {
        this.query('CREATE TABLE IF NOT EXISTS places (id INTEGER PRIMARY KEY AUTOINCREMENT, description TEXT, address TEXT)')
        .catch(err => {
            console.error('Unable to create initial storage tables', err.tx, err.err);
        });
    }

    getAllPlaces(): Promise<any[]> {
        return new Promise((resolve, reject) => {
     
            let sql = 'SELECT * FROM places ORDER BY description';
            this.query(sql, []).then((data) => {
                this.places = [];
                if(data.res.rows.length > 0) {
                    for(let i = 0; i < data.res.rows.length; i++) {
                        this.places.push(data.res.rows.item(i));
                    }
                    //let places = this.places;
                    console.log(this.places);
                }
                resolve(this.places);
            }, (error) => {
                console.log("ERROR: " + JSON.stringify(error));
                reject(error.message || error)
            });
     
        });
    }

    filterItems(searchTerm) {
        return this.places.filter((item) => {
            console.log(searchTerm);
            //return item.description.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
        });     
    }
    
	placeSave(data) {
	    let sql = 'INSERT INTO places (description, address) VALUES (?, ?)';
	    // return the query which happens to be a promise.
	    return this.query(sql, [data.description, data.address]);
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
                this.db.transaction((tx: any) => {
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
    getPlace(key: string): Promise<any> {
        return this.query('SELECT * FROM places WHERE id = ? LIMIT 1', [key])
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
