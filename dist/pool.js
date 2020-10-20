"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pool = void 0;
var sequelize_1 = require("sequelize");
var Pool = /** @class */ (function () {
    /**
     * host port database user password
     * @param config 数据库连接配置
     */
    function Pool(config) {
        if (Pool.instance == null) {
            Pool.instance = this.initPool(config);
        }
    }
    /**
     * 初始化连接池
     * @param config 配置
     */
    Pool.prototype.initPool = function (config) {
        return new sequelize_1.Sequelize(config.database, config.user, config.password, {
            host: config.host,
            port: config.port,
            pool: config.pool,
            logging: config.logging,
            dialect: config.dialect,
            define: { underscored: true },
        });
    };
    /**
     * 定义模型，自动为每一个模型设置 主键、created、modified
     * @param modelName 模型名
     * @param attributes 属性
     */
    Pool.prototype.defineModel = function (modelName, attributes) {
        // 默认添加三个字段
        if (!attributes.id) {
            attributes.id = {
                type: sequelize_1.DataTypes.UUIDV4,
                allowNull: false,
                primaryKey: true,
                defaultValue: sequelize_1.UUIDV4,
            };
        }
        if (!attributes.modified) {
            attributes.modified = {
                type: sequelize_1.DataTypes.BIGINT,
                allowNull: false,
            };
        }
        if (!attributes.created) {
            attributes.created = {
                type: sequelize_1.DataTypes.BIGINT,
                allowNull: false,
            };
        }
        return Pool.instance.define(modelName, attributes, {
            tableName: modelName,
            timestamps: false,
            underscored: false,
            hooks: {
                /// 创建/修改 时间变动
                beforeValidate: function (obj) {
                    var now = Date.now();
                    if (obj.isNewRecord) {
                        obj.created = now;
                        obj.modified = now;
                    }
                    else {
                        obj.modified = now;
                    }
                },
            },
        });
    };
    return Pool;
}());
exports.Pool = Pool;
