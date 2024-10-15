package com.johnny.bank.service.resource.dataSource.impl;

import com.johnny.bank.model.resource.dataResource.DetailHistory;
import com.johnny.bank.repository.localRepo.IDetailCollapseInfoRepo;
import com.johnny.bank.service.resource.dataSource.IDetailCollapseInfoService;
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
public class DetailCollapseInfoService implements IDetailCollapseInfoService {


    private final IDetailCollapseInfoRepo ICollapseInfoRepo;

    @Autowired
    public DetailCollapseInfoService(IDetailCollapseInfoRepo ICollapseInfoRepo) {
        this.ICollapseInfoRepo = ICollapseInfoRepo;
    }

    @Override
    public List<DetailHistory> getAllDetail() {
        return ICollapseInfoRepo.findAll();
    }

    @Override
    public DetailHistory getDetailByUuid(String uuid) {
        return ICollapseInfoRepo.findDetailHistoriesByUuid(uuid);
    }
}
