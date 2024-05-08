package com.johnny.bank.service.node.impl;

import com.johnny.bank.model.node.ParamNode;
import com.johnny.bank.repository.nodeRepo.IParamNodeRepo;
import com.johnny.bank.repository.nodeRepo.ITaskNodeRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @Author: Johnny Tang
 * @Date: 2023/12/21
 * @Description:
 */
@Service("ParamNodeService")
public class ParamNodeService extends NodeService<ParamNode>{

    @Autowired
    public void setBaseNodeRepo(IParamNodeRepo IBaseNodeRepo) {
        this.IBaseNodeRepo = IBaseNodeRepo;
    }

    List<ParamNode> getParamNodeByModelId(String modelId) {
        return ((IParamNodeRepo)IBaseNodeRepo).findParamNodesByModelId(modelId);
    }

    List<ParamNode> getParamNodeByModelIdAndCategory(String modelId, String category) {
        return ((IParamNodeRepo)IBaseNodeRepo).findParamNodesByModelIdAndCategory(modelId, category);
    }
}
