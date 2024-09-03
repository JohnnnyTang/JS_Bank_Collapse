import gdal2tiles
import sys

# tif_path = 'C:\\Users\\DMK\\Desktop\\raster\\2023Before.tif'
# tiles_path = 'C:\\Users\\DMK\\Desktop\\tiles'


if __name__ == '__main__':
    print(sys.argv)
    tif_path = sys.argv[1]
    tiles_path = sys.argv[2]
    zoom = sys.argv[3]
    tilesize = sys.argv[4]

    gdal2tiles.generate_tiles(tif_path, tiles_path, zoom=zoom, tilesize=tilesize, epsg="3857")