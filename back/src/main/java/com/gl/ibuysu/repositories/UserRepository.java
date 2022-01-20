package com.gl.ibuysu.repositories;

import java.util.Optional;
import com.gl.ibuysu.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User,Long> {
    @Query(value = "select u FROM User u WHERE u.email=:email AND u.password=:password")
    Optional<User> findByEmailAndPassword(String email, String password);

    @Query(value = "select u FROM User u WHERE u.apiKey=:apiKey")
    Optional<User> findByApiKey(String apiKey);

    @Query(value = "select u.apiKey FROM User u WHERE u.id = :id")
    String findUserApiKey(Long id);

}
