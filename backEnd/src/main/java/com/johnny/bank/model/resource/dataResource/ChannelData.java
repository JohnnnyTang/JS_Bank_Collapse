package com.johnny.bank.model.resource.dataResource;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

/**
 * @projectName: backEnd
 * @package: com.johnny.bank.model.resource.dataResource
 * @className: ChannelData
 * @author: Johnny Tang
 * @description: TODO
 * @date: 2024/1/22 11:25
 * @version: 1.0
 */
@Getter
@Setter
@EqualsAndHashCode()
@ToString()
@Document(collection = "channelTest")
@JsonInclude(JsonInclude.Include.NON_NULL)
//@NoArgsConstructor
//@Builder
//@AllArgsConstructor
public class ChannelData {
    @Id
    String id;
    String name;
    String type;
    List<List<Double>> xyCoords;
    List<List<Double>> llCoords;
    Date createTime;
    Date updateTime;
    boolean isActive;
    String desc;
}
