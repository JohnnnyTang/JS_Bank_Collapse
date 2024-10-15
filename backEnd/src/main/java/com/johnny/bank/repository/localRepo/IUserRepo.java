package com.johnny.bank.repository.localRepo;

import com.johnny.bank.model.common.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

/**
 * Created with IntelliJ IDEA.
 *
 * @Author: Chry
 * @Date: 2024/7/2 22:48
 * @Description:
 */
public interface IUserRepo extends MongoRepository<User,String> {

    @Query("{ 'email': ?0, 'password': ?1 }")
    User findByEmailAndPassword(String email, String password);
}
