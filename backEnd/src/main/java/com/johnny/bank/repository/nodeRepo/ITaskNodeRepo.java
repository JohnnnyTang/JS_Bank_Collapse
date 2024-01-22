package com.johnny.bank.repository.nodeRepo;

import com.johnny.bank.model.node.TaskNode;
import com.johnny.bank.repository.nodeRepo.base.IBaseNodeRepo;
import org.springframework.stereotype.Repository;

/**
 * @Author: Johnny T
 * @Date: 2023/12/21
 * @Description:
 */
@Repository("TaskNodeRepo")
public interface ITaskNodeRepo extends IBaseNodeRepo<TaskNode> {
}
