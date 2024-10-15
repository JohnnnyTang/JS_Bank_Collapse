package com.johnny.bank.model.node.base;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * @Author: Johnny T
 * @Date: 2023/12/12
 * @Description: Base node type for resource node
 */

@Data
@Builder(builderMethodName = "baseNodeBuilder")
@AllArgsConstructor
@Document(collection = "baseNode")
@CompoundIndex(name = "category_name_idx", def = "{'category': 1, 'name': 1}")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class BaseNode {
    @Id
    String id;
    //    String nodeType;
    String name;
    String auth;
    String category;
    String path;
}