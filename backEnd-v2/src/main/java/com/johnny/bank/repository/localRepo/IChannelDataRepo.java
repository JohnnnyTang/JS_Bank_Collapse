package com.johnny.bank.repository.localRepo;

import com.johnny.bank.model.resource.dataResource.ChannelData;
import org.springframework.data.mongodb.repository.MongoRepository;
//import org.springframework.stereotype.Repository;

public interface IChannelDataRepo extends MongoRepository<ChannelData, String> {
}

