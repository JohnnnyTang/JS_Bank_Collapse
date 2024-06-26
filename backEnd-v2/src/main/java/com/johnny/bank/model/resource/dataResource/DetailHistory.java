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
@Document(collection = "detailHistoryInfo")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DetailHistory {
    @Id
    private String id;
    private String uuid;
    private String basic;
    private String cause;
    private String plan;
    private String after;
    private String video;
}
