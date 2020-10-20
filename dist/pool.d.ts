import { Sequelize, ModelAttributes, Model } from "sequelize";
interface PoolOpations {
    max?: 5 | number;
    min?: 0 | number;
    idle?: 10000 | number;
}
interface Config {
    host: string;
    port: number;
    database: string;
    user: string;
    password: string;
    pool?: PoolOpations;
    logging?: boolean;
    dialect?: "mysql" | "postgres" | "sqlite" | "mariadb" | "mssql" | undefined;
}
export declare class Pool {
    static instance: Sequelize;
    /**
     * host port database user password
     * @param config 数据库连接配置
     */
    constructor(config: Config);
    /**
     * 初始化连接池
     * @param config 配置
     */
    private initPool;
    /**
     * 定义模型，自动为每一个模型设置 主键、created、modified
     * @param modelName 模型名
     * @param attributes 属性
     */
    defineModel(modelName: string, attributes: ModelAttributes): import("sequelize/types").ModelCtor<Model<any, any>>;
}
export {};
