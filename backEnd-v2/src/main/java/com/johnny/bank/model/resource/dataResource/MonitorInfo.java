package com.johnny.bank.model.resource.dataResource;

import com.alibaba.fastjson2.annotation.JSONField;
import com.johnny.bank.model.resource.dataResource.base.StaticInfoData;
import lombok.*;

import java.sql.Timestamp;

/**
 * @Author: Johnny Tang
 * @Date: 2023/12/28
 * @Description:
 */
@Getter
@Setter
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@NoArgsConstructor
public class MonitorInfo extends StaticInfoData {
     private String stationCode;
     private String machineId;
     private String name;
     private Character type;
     private Double longitude;
     private Double latitude;
     private Double elevation;
     private Integer sectionId;
     @JSONField(format = "yyyy-MM-dd HH:mm:ss")
     private Timestamp inTime;
     @JSONField(format = "yyyy-MM-dd HH:mm:ss")
     private Timestamp begTime;
     @JSONField(format = "yyyy-MM-dd HH:mm:ss")
     private Timestamp endTime;
}
