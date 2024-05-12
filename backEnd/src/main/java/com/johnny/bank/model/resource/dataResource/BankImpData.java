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
 * @className: BankImpData
 * @author: Johnny Tang
 * @description: TODO
 * @date: 2024/1/22 12:41
 * @version: 1.0
 */
@Getter
@Setter
@EqualsAndHashCode()
@ToString()
@Document(collection = "warning")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class BankImpData {
    @Id
    String id;
    String cityName;
    String riverName;
    Integer number;
    String bankName;
    Integer warningLevel;
    Float monitoringLength;
    List<List<Double>> coord;
    String memo;
    String description;
    String state;
    Date createTime;
    Date updateTime;
}
