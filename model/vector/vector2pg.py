import json

import geopandas as gpd
import psycopg2
from psycopg2 import sql
import sys

def get_column_definitions(gdf):
    column_defs = []
    for col in gdf.columns:
        if col == 'geom' or col == 'geometry' or col == 'id':
            continue
        col_type = 'TEXT'  # 默认类型，您可以根据需要修改
        column_defs.append(f"{col} {col_type}")
    return ', '.join(column_defs)

def get_column_inserts(gdf):
    column_inserts = []
    for col in gdf.columns:
        if col == 'geom' or col == 'geometry' or col == 'id':
            continue
        column_inserts.append(f"{col}")
    return ','.join(column_inserts)

filePath = sys.argv[1]
finalTableName = sys.argv[2]
dbname = sys.argv[3]
user = sys.argv[4]
password = sys.argv[5]
host = sys.argv[6]
port = sys.argv[7]

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
target_crs = 'EPSG:3857'
gdf = gdf.to_crs(target_crs)
srid = int(gdf.crs.to_string().split(':')[-1])
# column_defs = ', '.join([f"{col} TEXT" for col in columns])
# column_insert = ','.join([f"{col}" for col in columns])
column_insert = get_column_inserts(gdf)
column_defs = get_column_definitions(gdf)
columns = column_insert.split(",")

# 创建一个临时的表来存储数据
temp_table_name = 'temp_shapefile'
cursor = conn.cursor()
cursor.execute(
    sql.SQL(f"CREATE TEMP TABLE {temp_table_name} (id serial PRIMARY KEY, geom GEOMETRY, if_important INTEGER, {column_defs})").format(
        table=sql.Identifier(temp_table_name),
    )
)

# 将几何数据转换为WKT格式并插入到临时表中
for index, row in gdf.iterrows():
    other_columns_values = [row[col] for col in columns]
    other_columns_placeholders = ', '.join(['%s'] * len(columns))
    insert_sql = sql.SQL(f"""
            INSERT INTO {temp_table_name} (geom, if_important, {column_insert})
            VALUES (ST_GeomFromText(%s, %s), 1, {other_columns_placeholders})
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
    sql.SQL(f"CREATE TABLE {finalTableName} (id serial PRIMARY KEY, geom GEOMETRY, if_important INTEGER, {column_defs})").format(
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