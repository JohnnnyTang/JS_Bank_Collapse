package com.johnny.bank.service.resource.dataResource;

import com.johnny.bank.model.resource.dataResource.CollapseHistory;

import java.util.List;

public interface ICollapseInfoService {
    List<CollapseHistory> getAllInfo();

    List<CollapseHistory> getAllInfoSortByDesc();

    List<CollapseHistory> getAllInfoWithDesc();
}
