
import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import * as config from 'config'
//Define the configuration of typeOrm using the TypeOrmModuleOptions Interface

const dbConfig = config.get('db');
export const typeOrmConfig: TypeOrmModuleOptions = {
    type: dbConfig.type,  //We are connecting to a postgres db
    host: process.env.RDS_HOSTNAME || dbConfig.host,
    port: process.env.RDS_PORT || dbConfig.port,
    username: process.env.RDS_USERNAME || dbConfig.username,
    password: process.env.RDS_PASSWORD || dbConfig.password,
    database: process.env.RDS_DB_NAME || dbConfig.database,
    entities: [__dirname + '/../**/*.entity.{ts,js}'],   // /../ goes one level up in the directory ** any folder, *.entity.ts any file  ending with .entity.ts
    synchronize: process.env.TYPEORM_SYNC || dbConfig.synchronize,
}