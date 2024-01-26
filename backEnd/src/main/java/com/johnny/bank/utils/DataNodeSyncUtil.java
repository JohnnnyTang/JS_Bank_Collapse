package com.johnny.bank.utils;

import com.johnny.bank.model.node.DataNode;
import com.johnny.bank.model.resource.dataResource.MonitorInfo;
import com.johnny.bank.model.resource.dataResource.base.DetailMonitorInfo;
import com.johnny.bank.model.resource.dataResource.base.StaticInfoData;
import com.johnny.bank.repository.nodeRepo.IDataNodeRepo;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * @Author: Johnny Tang
 * @Date: 2024/1/3
 * @Description: deal with data and node sync problems
 */
public class DataNodeSyncUtil {
    public static final List<String> deviceTypeList = new ArrayList<>(
            Arrays.asList("Gnss", "Inclinometer", "Manometer", "Stress"));
//    public static <T extends StaticInfoData> void SyncNodeAndData(
//            List<T> dataList, IDataNodeRepo dataNodeRepo, DataNode parentNode) {
//        List<String> nameList = new ArrayList<>();
//        for(T aData:dataList) {
//            nameList.add(aData.getName());
//            DataNode singleNode = dataNodeRepo.getNodeByCategoryAndName(
//                    "staticInfoItem", aData.getName());
//            if(singleNode == null) {
//                DataNode newNode = dataNodeRepo.save(
//                        DataNode.dataNodeBuilder().name(aData.getName())
//                                .usage(parentNode.getUsage()).auth("all").apiPrefix(parentNode.getApiPrefix())
//                                .category("staticInfoItem").path(parentNode.getPath()+parentNode.getName()+',')
//                                .build()
//                );
//                System.out.println("create node: " + newNode.getId());
//            }
//        }
//        List<DataNode> childList = dataNodeRepo.getNodeChildByPath("," + parentNode.getName() + ",$");
//        if(childList.size() != dataList.size()) {
//            for(DataNode childNode: childList) {
//                if(!nameList.contains(childNode.getName())) {
//                    dataNodeRepo.deleteById(childNode.getId());
//                    System.out.println("delete node: " + childNode.getId());
//                }
//            }
//        }
//    }

    public static <T extends StaticInfoData> void SyncNoLinkDataNodeWhenDataChanged(
            List<T> dataList, IDataNodeRepo dataNodeRepo, DataNode parentNode
    ) {
        List<String> linkCodeList = new ArrayList<>();
        for(T aData: dataList){
            String linkCodeOfDevice = aData.getCode();
            linkCodeList.add(linkCodeOfDevice);
            List<DataNode> linkedNodeList = dataNodeRepo.getNodeByLinkCode(linkCodeOfDevice);
            if(linkedNodeList.isEmpty()) {
                String newNodeCategory = parentNode.getCategory().replace("Group", "Item");
                DataNode newNode = dataNodeRepo.save(
                        DataNode.dataNodeBuilder().name(aData.getCode()).bank(parentNode.getBank())
                                .linkCode(linkCodeOfDevice).usage(parentNode.getUsage()).auth("all")
                                .apiPrefix(parentNode.getApiPrefix()).category(newNodeCategory)
                                .path(parentNode.getPath() + parentNode.getName() + ",")
                                .build()
                );
                System.out.println("Create a child node of " + parentNode.toString() + ":\n" + newNode.toString());
            }
        }
        List<DataNode> childList = dataNodeRepo.getNodeChildByPath("," + parentNode.getName() + ",$");
        for(DataNode childNode: childList) {
            if(!linkCodeList.contains(childNode.getLinkCode())) {
                List<DataNode> dataNodeDeletedList =  dataNodeRepo.deleteByLinkCode(childNode.getLinkCode());
                System.out.println("delete node: " + dataNodeDeletedList.toString());
            }
        }
    }


    public static void SyncDeviceNodeWhenBaseGroupDataChanged(
            List<MonitorInfo> monitorInfoList, IDataNodeRepo dataNodeRepo,
            DataNode parentNode) {
        List<String> linkCodeList = new ArrayList<>();
//        DataNode parentNode = dataNodeRepo.getNodeByCategoryAndName("DeviceInfoGroup", "deviceInfo");
        List<DataNode> linkedParentNodeList = dataNodeRepo.getNodeByLinkCode(parentNode.getLinkCode());

        // instance missing data node as to data item
        for(MonitorInfo aData: monitorInfoList) {
            String linkCodeOfDevice = aData.getCode();
            linkCodeList.add(linkCodeOfDevice);
            List<DataNode> linkedNodeList = dataNodeRepo.getNodeByLinkCode(linkCodeOfDevice);
            // add node process
            if(linkedNodeList.isEmpty()) {
                String deviceType = deviceTypeList.get((Character.getNumericValue(aData.getType())-1));
                for(DataNode aParentNode: linkedParentNodeList) {
                    String newNodeCategory = aParentNode.getCategory()
                            .replace("Group", "Item")
                            .replace("Monitor", deviceType);
                    String newNodeParentName = aParentNode.getName().replace("monitor", deviceType.toLowerCase());
                    String newNodePath = aParentNode.getPath()+aParentNode.getName()+','+newNodeParentName+',';
                    DataNode newNode = dataNodeRepo.save(
                            DataNode.dataNodeBuilder().name(aData.getName()).linkCode(linkCodeOfDevice)
                                    .usage(aParentNode.getUsage()).auth("all").apiPrefix(aParentNode.getApiPrefix())
                                    .category(newNodeCategory).bank(aParentNode.getBank())
                                    .path(newNodePath)
                                    .build()
                    );
                    System.out.println("Create a child node of " + aParentNode.toString() + ":\n" + newNode.toString());
                }
            }
        }
        List<DataNode> groupNode = dataNodeRepo.getNodeChildByPath("," + parentNode.getName() + ",$");
        List<DataNode> childList = new ArrayList<>();
        for(DataNode aGroupNode: groupNode) {
            childList.addAll(dataNodeRepo.getNodeChildByPath("," + aGroupNode.getName() + ",$"));
        }
        // delete redundant data nodes connected by linkCode
        for(DataNode childNode: childList) {
            if(!linkCodeList.contains(childNode.getLinkCode())) {
                List<DataNode> dataNodeDeletedList =  dataNodeRepo.deleteByLinkCode(childNode.getLinkCode());
                System.out.println("delete node: " + dataNodeDeletedList.toString());
            }
        }
    }

    public static void SyncDeviceNodeWhenSpecificGroupDataChanged(
            List<DetailMonitorInfo> monitorInfoList, IDataNodeRepo dataNodeRepo,
            DataNode parentNode) {
        List<String> linkCodeList = new ArrayList<>();
//        DataNode parentNode = dataNodeRepo.getNodeByCategoryAndName("DeviceInfoGroup", "deviceInfo");
        List<DataNode> linkedParentNodeList = dataNodeRepo.getNodeByLinkCode(parentNode.getLinkCode());

        // instance missing data node as to data item
        for(DetailMonitorInfo aData: monitorInfoList) {
            String linkCodeOfDevice = aData.getCode();
            linkCodeList.add(linkCodeOfDevice);
            List<DataNode> linkedNodeList = dataNodeRepo.getNodeByLinkCode(linkCodeOfDevice);
            // add node process
            if(linkedNodeList.isEmpty()) {
//                String deviceType = deviceTypeList.get((Character.getNumericValue(aData.getType())-1));
                for(DataNode aParentNode: linkedParentNodeList) {
                    String newNodeCategory = aParentNode.getCategory()
                            .replace("Group", "Item");
//                            .replace("Monitor", deviceType);
//                    String newNodeParentName = aParentNode.getName().replace("monitor", deviceType.toLowerCase());
                    String newNodePath = aParentNode.getPath()+','+aParentNode.getName()+',';
                    DataNode newNode = dataNodeRepo.save(
                            DataNode.dataNodeBuilder().name(aData.getMachineId()).linkCode(linkCodeOfDevice)
                                    .usage(aParentNode.getUsage()).auth("all").apiPrefix(aParentNode.getApiPrefix())
                                    .category(newNodeCategory).bank(aParentNode.getBank())
                                    .path(newNodePath)
                                    .build()
                    );
                    System.out.println("Create a child node of " + aParentNode.toString() + ":\n" + newNode.toString());
                }
            }
        }
//        List<DataNode> groupNode = dataNodeRepo.getNodeChildByPath("," + parentNode.getName() + ",$");
        List<DataNode> childList = new ArrayList<>();
        for(DataNode aLinkedParentNode: linkedParentNodeList) {
            childList.addAll(dataNodeRepo.getNodeChildByPath("," + aLinkedParentNode.getName() + ",$"));
        }
        // delete redundant data nodes connected by linkCode
        for(DataNode childNode: childList) {
            if(!linkCodeList.contains(childNode.getLinkCode())) {
                List<DataNode> dataNodeDeletedList =  dataNodeRepo.deleteByLinkCode(childNode.getLinkCode());
                System.out.println("delete node: " + dataNodeDeletedList.toString());
            }
        }
    }
}
