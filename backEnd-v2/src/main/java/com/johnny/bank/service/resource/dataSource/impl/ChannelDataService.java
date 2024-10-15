package com.johnny.bank.service.resource.dataSource.impl;

import com.johnny.bank.model.resource.dataResource.ChannelData;
import com.johnny.bank.repository.localRepo.IChannelDataRepo;
import com.johnny.bank.service.resource.dataSource.IChannelDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @projectName: backEnd
 * @package: com.johnny.bank.service.resource.data.impl
 * @className: ChannelDataService
 * @author: Johnny Tang
 * @description: TODO
 * @date: 2024/1/22 11:37
 * @version: 1.0
 */
@Service("ChannelDataService")
public class ChannelDataService implements IChannelDataService {

    private final IChannelDataRepo ChanelRepo;

    @Autowired
    public ChannelDataService(IChannelDataRepo ChanelRepo) {
        this.ChanelRepo = ChanelRepo;
    }

    @Override
    public List<ChannelData> findAll() {
        return ChanelRepo.findAll();
    }
}
