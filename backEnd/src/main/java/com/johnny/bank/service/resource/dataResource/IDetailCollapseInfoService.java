package com.johnny.bank.service.resource.dataResource;

import com.johnny.bank.model.resource.dataResource.DetailHistory;

import java.util.List;

public interface IDetailCollapseInfoService {
    List<DetailHistory> getAllDetail();

    DetailHistory getDetailByUuid(String uuid);

}
