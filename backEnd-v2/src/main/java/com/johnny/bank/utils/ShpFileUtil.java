package com.johnny.bank.utils;

import org.geotools.feature.FeatureCollection;
import org.geotools.data.DataStore;
import org.geotools.data.DataStoreFinder;
import org.geotools.data.FeatureSource;
import org.opengis.feature.simple.SimpleFeature;
import org.opengis.feature.simple.SimpleFeatureType;
import java.io.File;
import java.io.IOException;
import java.util.*;
import org.opengis.filter.Filter;

/**
 * @projectName: backEnd
 * @package: com.johnny.bank.model.resource.dataResource
 * @className: ShpFileUtil
 * @author: Chry
 * @description: TODO
 * @date: 2024/1/27 11:32
 * @version: 1.0
 */
public class ShpFileUtil {
    /*
     * @param zipFile: 压缩包文件地址
     * @return FeatureCollection
     * @author pangshicheng
     * @description 解析shp压缩包，并返回解析出的 FeatureCollection
     * @date 2023/7/18 16:02
     */
    public static FeatureCollection getFeatureCollectionByShpFile(File zipFile, String tempDir) throws IOException {
        try {
            File shapeDir = new File(tempDir + File.separator + new Date().getTime());
            shapeDir.mkdir();
            List<String> files = ZipUtil.unZipFiles(zipFile, shapeDir.getPath() + File.separator);
            String shapFileName = "";
            for (String fileName : files) {
                String suffix = fileName.substring(fileName.lastIndexOf(".") + 1);
                if ("shp".equals(suffix)) {
                    shapFileName = fileName;
                }
            }
            File shapeFile = new File(shapFileName);
//            List<SimpleFeature> list = new ArrayList<>();
            Map<String, Object> shapeFileParams = new HashMap();
            shapeFileParams.put("url", shapeFile.toURI().toURL());
            // 设置编码
            shapeFileParams.put("charset", "GBK");
            DataStore dataStore = DataStoreFinder.getDataStore(shapeFileParams);
            if (dataStore == null) {
                throw new RuntimeException("couldn't load the damn data store: " + shapeFileParams);
            }
            String typeName = dataStore.getTypeNames()[0];
            FeatureSource<SimpleFeatureType, SimpleFeature> source = dataStore.getFeatureSource(typeName);
            Filter filter = Filter.INCLUDE;
            FeatureCollection<SimpleFeatureType, SimpleFeature> collection = source.getFeatures(filter);
            return collection;
        }catch (Exception e){
            throw e;
        }
    }
}