import {
  Sequelize,
  UUIDV4,
  ModelAttributes,
  Model,
  DataTypes,
} from "sequelize";

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

interface ModelExtends extends Model {
  created?: number;
  modified?: number;
}

export class Pool {
  static instance: Sequelize;
  /**
   * host port database user password
   * @param config 数据库连接配置
   */
  constructor(config: Config) {
    if (Pool.instance == null) {
      Pool.instance = this.initPool(config);
    }
  }
  /**
   * 初始化连接池
   * @param config 配置
   */
  private initPool(config: Config) {
    return new Sequelize(config.database, config.user, config.password, {
      host: config.host,
      port: config.port,
      pool: config.pool,
      logging: config.logging,
      dialect: config.dialect,
      define: { underscored: true },
    });
  }
  /**
   * 定义模型，自动为每一个模型设置 主键、created、modified
   * @param modelName 模型名
   * @param attributes 属性
   */
  public defineModel(modelName: string, attributes: ModelAttributes) {
    // 默认添加三个字段
    if (!attributes.id) {
      attributes.id = {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: UUIDV4,
      };
    }
    if (!attributes.modified) {
      attributes.modified = {
        type: DataTypes.BIGINT,
        allowNull: false,
      };
    }
    if (!attributes.created) {
      attributes.created = {
        type: DataTypes.BIGINT,
        allowNull: false,
      };
    }

    return Pool.instance.define(modelName, attributes, {
      tableName: modelName,
      timestamps: false,
      underscored: false,
      hooks: {
        /// 创建/修改 时间变动
        beforeValidate: (obj: ModelExtends) => {
          let now = Date.now();
          if (obj.isNewRecord) {
            obj.created = now;
            obj.modified = now;
          } else {
            obj.modified = now;
          }
        },
      },
    });
  }
}
