package com.gl.ibuysu.controllers;

import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import com.gl.ibuysu.models.Purchaser;
import com.gl.ibuysu.models.Seller;
import com.gl.ibuysu.models.User;
import com.gl.ibuysu.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
public class UserController {
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/seller")
    public User addSeller(@RequestBody Seller seller) {
        return this.saveUser(seller, "seller");
    }

    @PostMapping("/purchaser")
    public User addPurchaser(@RequestBody Purchaser purchaser) {
        return this.saveUser(purchaser, "purchaser");
    }

    @GetMapping("/user/{apiKey}")
    public Optional<User> getAuthUser(@PathVariable("apiKey") final String apiKey) {
        Optional<User> user = userRepository.findByApiKey(apiKey);
        if(user.isEmpty()){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        return user;
    }

    @GetMapping("/user-by-id/{id}")
    public Optional<User> getUserById(@PathVariable("id") final Long id) {
        Optional<User> user = userRepository.findById(id);
        if(user.isEmpty()){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        return user;
    }

    private User saveUser(User user, String type) {
        // TODO : Condition to be removed
        user.setApiKey(type + "-" + (((Objects.equals(user.getFirstname(), "John")) || ((Objects.equals(user.getFirstname(), "Jane"))) ? "123" : UUID.randomUUID())));
        return this.userRepository.save(user);
    }

}
