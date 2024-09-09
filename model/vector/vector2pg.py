import json

import geopandas as gpd
import psycopg2
from psycopg2 import sql
import sys

filePath = sys.argv[1]
finalTableName = sys.argv[2]
columns = sys.argv[3].split(",")
dbname = sys.argv[4]
user = sys.argv[5]
password = sys.argv[6]
host = sys.argv[7]
port = sys.argv[8]

conn = psycopg2.connect(
    dbname=dbname,
    user=user,
    password=password,
    host=host,
    port=port
)

# filepath = "D:/1study/Work/2024_1_10_bank/spatialData/民主沙/mzsArea/mzs_bank_area_one.shp"
# 读取Shapefile
gdf = gpd.read_file(filePath)
srid = int(gdf.crs.to_string().split(':')[-1])
column_defs = ', '.join([f"{col} TEXT" for col in columns])
column_insert = ','.join([f"{col}" for col in columns])

# 创建一个临时的表来存储数据
temp_table_name = 'temp_shapefile'
cursor = conn.cursor()
cursor.execute(
    sql.SQL(f"CREATE TEMP TABLE {temp_table_name} (id serial PRIMARY KEY, geometry GEOMETRY, {column_defs})").format(
        table=sql.Identifier(temp_table_name),
    )
)

# 将几何数据转换为WKT格式并插入到临时表中
for index, row in gdf.iterrows():
    other_columns_values = [row[col] for col in columns]
    other_columns_placeholders = ', '.join(['%s'] * len(columns))
    insert_sql = sql.SQL(f"""
            INSERT INTO {temp_table_name} (geometry, {column_insert})
            VALUES (ST_GeomFromText(%s, %s), {other_columns_placeholders})
        """).format(
        table=sql.Identifier(temp_table_name)
    )
    insert_params = [row.geometry.wkt, srid] + other_columns_values
    cursor.execute(insert_sql, insert_params)

# 提交事务
conn.commit()

# 将临时表数据导入到最终的表中
cursor.execute(
    sql.SQL(f"DROP TABLE IF EXISTS {finalTableName} CASCADE")
)
cursor.execute(
    sql.SQL(f"CREATE TABLE {finalTableName} (id serial PRIMARY KEY, geometry GEOMETRY, {column_defs})").format(
        table=sql.Identifier(finalTableName),
    )
)
cursor.execute(
    sql.SQL(f"INSERT INTO {finalTableName} SELECT * FROM {temp_table_name}").format(
        table=sql.Identifier(finalTableName),
    )
)

# 提交事务并关闭连接
conn.commit()
cursor.close()
conn.close()