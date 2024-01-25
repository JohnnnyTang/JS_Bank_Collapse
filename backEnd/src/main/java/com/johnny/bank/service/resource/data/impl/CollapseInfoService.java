package com.johnny.bank.service.resource.data.impl;

import com.johnny.bank.model.resource.dataResource.CollapseHistory;
import com.johnny.bank.repository.localRepo.ICollapseInfoRepo;
import com.johnny.bank.service.resource.data.ICollapseInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @projectName: backEnd
 * @package: com.johnny.bank.service.resource.data.impl
 * @className: CollapseInfoService
 * @author: Johnny Tang
 * @description: TODO
 * @date: 2024/1/24 15:10
 * @version: 1.0
 */
@Service
public class CollapseInfoService implements ICollapseInfoService {


    private final ICollapseInfoRepo ICollapseInfoRepo;

    @Autowired
    public CollapseInfoService(ICollapseInfoRepo ICollapseInfoRepo) {
        this.ICollapseInfoRepo = ICollapseInfoRepo;
    }

    @Override
    public List<CollapseHistory> getAllInfo() {
        return ICollapseInfoRepo.findAll();
    }

    @Override
    public List<CollapseHistory> getAllInfoWithDesc() {
        return ICollapseInfoRepo.findInfoWithDescription();
    }
}
