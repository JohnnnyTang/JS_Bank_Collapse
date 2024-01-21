package com.johnny.bank.model.node;


import com.alibaba.fastjson2.JSONObject;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.johnny.bank.model.node.base.BaseNode;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.DBRef;
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
@Document(collection = "taskNode")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TaskNode extends BaseNode {
    @DBRef
    ModelNode modelNode;
//    String modelId;
    @DBRef
    ParamNode paramNode;
    String dataId;
    String status;
    JSONObject result;

    @Builder(builderMethodName = "taskNodeBuilder")
    public TaskNode(
            String id, String name, String auth,
            String category, String path,
            String modelId, String paramId, String dataId, String status, JSONObject result
    ) {
        super(id, name, auth, category, path);
        this.modelNode = ModelNode.modelNodeBuilder().id(modelId).build();
        this.paramNode = ParamNode.paramNodeBuilder().id(paramId).build();
        this.dataId = dataId;
        this.status = status;
        this.result = result;
    }
}
