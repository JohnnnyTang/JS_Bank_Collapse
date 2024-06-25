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
    @DBRef
    ParamNode paramNode;
    @DBRef
    DataNode dataNode;
    String status;
    Boolean ifAuto; // 是否为自动任务
    JSONObject result;

    @Builder(builderMethodName = "taskNodeBuilder")
    public TaskNode(
            String id, String name, String auth,
            String category, String path,
            ModelNode modelNode, ParamNode paramNode, DataNode dataNode,
            String status, JSONObject result, Boolean ifAuto
    ) {
        super(id, name, auth, category, path);
        this.modelNode = modelNode;
        this.paramNode = paramNode;
        this.dataNode = dataNode;
        this.status = status;
        this.result = result;
        this.ifAuto = ifAuto;
    }
}
