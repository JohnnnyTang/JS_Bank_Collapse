package com.johnny.bank.model.resource.dataResource;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

/**
 * @Author: Johnny Tang
 * @Date: 2024/5/14
 * @Description:
 */
@Getter
@Setter
@EqualsAndHashCode()
@ToString()
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SectionLineInfo {
    private Integer id;
    private double stX;
    private double stY;
    private double endX;
    private double endY;
    private String name;
    private String label;
}
