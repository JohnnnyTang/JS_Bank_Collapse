package com.johnny.bank.model.node;


import com.alibaba.fastjson2.JSONObject;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.johnny.bank.model.node.base.BaseNode;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * @Author: Johnny T
 * @Date: 2023/12/19
 * @Description:
 */

@Getter
@Setter
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@Document(collection = "modelNode")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ModelNode extends BaseNode {
    String program;
    JSONObject usage;

    @Builder(builderMethodName = "modelNodeBuilder")
    public ModelNode(
            String id, String name, String auth,
            String category, String path,
            String program, JSONObject usage
    ) {
        super(id, name, auth, category, path);
        this.program = program;
        this.usage = usage;
    }
}
