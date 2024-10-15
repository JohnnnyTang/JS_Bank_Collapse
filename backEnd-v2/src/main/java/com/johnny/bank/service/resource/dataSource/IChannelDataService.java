package com.johnny.bank.service.resource.dataSource;

import com.johnny.bank.model.resource.dataResource.ChannelData;

import java.util.List;

public interface IChannelDataService {
    List<ChannelData> findAll();
}
