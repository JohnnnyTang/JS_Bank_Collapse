package com.johnny.bank.model.resource.dataResource;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

/**
 * @projectName: backEnd
 * @package: com.johnny.bank.model.resource.dataResource
 * @className: CollapseHistory
 * @author: Johnny Tang
 * @description: TODO
 * @date: 2024/1/24 14:58
 * @version: 1.0
 */
@Getter
@Setter
@EqualsAndHashCode()
@ToString()
@Document(collection = "historyInfo")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CollapseHistory {
    @Id
    private String id;
    private String length;
    private String district;
    private String time;
    private String river;
    private String ratio;
    private String side;
    private String width;
    private String place;
    private String type;
    private String description;
    private String state;
    private Date createTime;
    private Date updateTime;
}
