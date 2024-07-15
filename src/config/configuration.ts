import { TypeOrmModuleOptions } from "@nestjs/typeorm";

interface Configuration {
	port: number;
	database: TypeOrmModuleOptions;
}

/**
 * 获取配置信息
 * @returns 配置信息对象 {Configuration}
 */
export default (): Configuration => {
	/**
	 * Development database configuration options.
	 */
	const DEV_DB_CONFIG: TypeOrmModuleOptions = {
		type: process.env.DB_TYPE as "mysql" | "mariadb",
		host: process.env.DB_HOST,
		port: Number(process.env.DB_PORT),
		username: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_DATABASE,
		// autoLoadEntities: true,
		synchronize: true,
	};

	/**
	 * Production database configuration options.
	 */
	const PROD_DB_CONFIG: TypeOrmModuleOptions = {
		type: process.env.DB_TYPE as "mysql" | "mariadb",
		host: process.env.DB_HOST,
		port: Number(process.env.DB_PORT),
		username: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_DATABASE,
		// autoLoadEntities: true,
		synchronize: true,
	};

	return {
		// 端口号
		port: parseInt(process.env.PORT, 10) || 3000,
		// 数据库配置
		database: process.env.NODE_ENV === "production" ? PROD_DB_CONFIG : DEV_DB_CONFIG,
	};
};
