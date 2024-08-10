package com.johnny.bank.utils;

import com.alibaba.fastjson2.JSONArray;
import com.alibaba.fastjson2.JSONObject;
import com.johnny.bank.model.node.DataNodeV2;

import java.util.Comparator;
import java.util.List;

/**
 * @Author: Johnny Tang
 * @Date: 2024/7/3
 * @Description:
 */
public class DataNodeUtil {
    public static JSONArray transferToFolderList(List<DataNodeV2> dataNodeList) {

        Comparator<DataNodeV2> DatanodeComparator = new Comparator<DataNodeV2>() {
            @Override
            public int compare(DataNodeV2 node1, DataNodeV2 node2) {
                // 正值返回
                String year1 = node1.getBasicInfo().getString("year");
                String year2 = node2.getBasicInfo().getString("year");
                String set1 = node1.getBasicInfo().getString("set");
                String set2 = node2.getBasicInfo().getString("set");
                String name1 = node1.getName();
                String name2 = node2.getName();
                if (!year1.equals(year2)) {
                    return year1.compareTo(year2);
                } else if (!set1.equals(set2)) {
                    return set1.compareTo(set2);
                } else if (!name1.equals(name2)) {
                    return name1.compareTo(name2);
                } else {
                    return 1;
                }
            }
        };
        JSONArray dataList = new JSONArray();
        // 首先做dataNode的排序
        dataNodeList.sort(DatanodeComparator);
        // 排序完成后新建dataList，向其中以此插入dataNode数据
        JSONObject currentSetListObj = new JSONObject();
        JSONArray currentSetList = new JSONArray();
        JSONObject currentYearListObj = new JSONObject();
        JSONArray currentYearList = new JSONArray();
        String firstYear = dataNodeList.get(0).getBasicInfo().getString("year");
        String firstSet = dataNodeList.get(0).getBasicInfo().getString("set");
        String firstName = dataNodeList.get(0).getName();
        String firstTemp = dataNodeList.get(0).getBasicInfo().getString("temp");
        String firstFileType = dataNodeList.get(0).getBasicInfo().getString("fileType");
        String firstPath = dataNodeList.get(0).getBasicInfo().getString("path");

        JSONObject firstNodeObj = new JSONObject();
        firstNodeObj.put("name",firstName);
        firstNodeObj.put("temp",firstTemp);
        firstNodeObj.put("fileType",firstFileType);
        firstNodeObj.put("path",firstPath);
        currentSetList.add(firstNodeObj);
        currentSetListObj.put("list",currentSetList);
        currentSetListObj.put("name",firstSet);
        currentYearList.add(currentSetListObj);
        currentYearListObj.put("year",firstYear);
        currentYearListObj.put("sets",currentYearList);
        dataList.add(currentYearListObj);

        for (int i = 1; i < dataNodeList.size(); i++) {
            DataNodeV2 dataNode = dataNodeList.get(i);
            String year = dataNode.getBasicInfo().getString("year");
            String set = dataNode.getBasicInfo().getString("set");
            String name = dataNode.getName();
            String temp = dataNode.getBasicInfo().getString("temp");
            String fileType = dataNode.getBasicInfo().getString("fileType");
            String path = dataNode.getBasicInfo().getString("path");
            JSONObject dataNodeObj = new JSONObject();
            dataNodeObj.put("name", name);
            dataNodeObj.put("temp", temp);
            dataNodeObj.put("fileType", fileType);
            dataNodeObj.put("path",path);
            if (year.equals(currentYearListObj.get("year"))) {
                // 若year与之前相同，则判断set
                if (set.equals(currentSetListObj.get("name"))) {
                    currentSetList.add(dataNodeObj);
                } else {
                    currentSetListObj = new JSONObject();
                    currentSetList = new JSONArray();
                    currentSetList.add(dataNodeObj);
                    currentSetListObj.put("list",currentSetList);
                    currentSetListObj.put("name",set);
                    currentYearList.add(currentSetListObj);
                }
            } else {
                // 创建新的year集合并向中间加入新建的set集合
                currentSetListObj = new JSONObject();
                currentSetList = new JSONArray();
                currentYearListObj = new JSONObject();
                currentYearList = new JSONArray();
                currentSetList.add(dataNodeObj);
                currentSetListObj.put("list",currentSetList);
                currentSetListObj.put("name",set);
                currentYearList.add(currentSetListObj);
                currentYearListObj.put("year",year);
                currentYearListObj.put("sets",currentYearList);
                dataList.add(currentYearListObj);
            }

        }
        return dataList;
    }
}
