import { Connection, Request, TYPES, ConnectionConfiguration } from "tedious";

const config1: ConnectionConfiguration = {
    server: 'localhost',
    authentication: { 
        type: 'default',
        options: {
            userName: 'appuser1',
            password: 'App123!'
        }
    },
    options: {
        database: process.env.DB_DATABASE || 'NotesDB',
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true,
        port: 1433
    }, 
};


export const executeQuery = async (queryString: string, parameters: { [key: string]: any } = {}): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        const connection = new Connection(config1);

        connection.on('connect', (err) =>{
            if (err) {
                console.error('Error conectando', err);
                reject(err);
                return;
            }

            const results: any[] = [];

            const request = new Request(queryString, (err) =>{
                connection.close();

                if(err) {
                    console.error('Error ejecutando Query: ', err);
                    reject(err);
                } else {
                    resolve(results);
                }
            });
            
            Object.keys(parameters).forEach(key => {
                const value = parameters[key];
                const sqlType = getSqlType(value);
                request.addParameter(key, sqlType, value);
            });

            request.on('row', (columns: any) => {
                const row: { [key: string]: any } = {};
                columns.forEach((column:any) => {
                    row[column.metadata.colName] = column.value;
                });
                results.push(row);
            });
            connection.execSql(request);
        });
        connection.connect();
});
};

export const executeNonQuery = async (queryString: string, parameters: { [key: string]: any } = {}): Promise<number> => {
    return new Promise((resolve, reject) => {
        const connection = new Connection(config1);

        connection.on('connect', (err) => {
            if (err){
                console.error('Error Conectando: ', err);
                reject(err);
                return;
            }

            const request = new Request(queryString, (err, rowCount) => {
                connection.close();

                if(err){
                    console.error('Error Ejecutando Query: ', err);
                    reject(err);
                } else {
                    resolve(rowCount || 0);
                }
            });

            Object.keys(parameters).forEach(key => {
                const value = parameters[key];
                const sqlType = getSqlType(value);
                request.addParameter(key, sqlType, value);
            });

            connection.execSql(request);
        });

        connection.connect();
    });
};

export const executeInsert = async (queryString: string, parameters: { [key: string]: any } = {}): Promise<any> => {
    const results = await executeQuery(queryString, parameters);
    return results[0] || null;
};

export const getOne = async (queryString: string, parameters: { [key: string]: any } = {}): Promise<any> => {
    const results = await executeQuery(queryString, parameters);
    return results[0] || null;
};

export const getMany = async (queryString: string, parameters: { [key: string]: any } = {}): Promise<any[]> => {
    return await executeQuery(queryString, parameters);
};

const getSqlType = (value: any) => {
    if (typeof value === 'string') {
        if (value.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)) {
            return TYPES.UniqueIdentifier;
        }
        return TYPES.NVarChar;
    }
    if (typeof value === 'number'){
        return Number.isInteger(value) ? TYPES.Int : TYPES.Float;
    }
    if (typeof value === 'boolean') return TYPES.Bit;
    if (value instanceof Date) return TYPES.DateTime;
    return TYPES.NVarChar;
};

export const testConnection = async (): Promise<{ success: boolean; message?: string; error?: any; data?: any }> => {
    try {
        const result = await executeQuery('SELECT @@VERSION as Version, GETDATE() as CurrentTime');
        return { 
            success: true, 
            message: 'Conexión establecida correctamente',
            data: result[0]
        };
    } catch (error) {
        console.error('Error de conexión:', error);
        return { success: false, error: error };
    }
};