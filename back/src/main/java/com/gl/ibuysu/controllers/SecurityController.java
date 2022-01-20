package com.gl.ibuysu.controllers;

import java.util.HashMap;
import java.util.Optional;
import com.gl.ibuysu.models.User;
import com.gl.ibuysu.repositories.UserRepository;
import com.gl.ibuysu.utils.LoginForm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
public class SecurityController {
    @Autowired
    public UserRepository userRepository;

    @PostMapping("/login")
    public HashMap<String, String> login(@RequestBody final LoginForm loginForm) {
        Optional<User> user = this.userRepository.findByEmailAndPassword(loginForm.getEmail(), loginForm.getPassword());
        if (user.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        String apiKey = this.userRepository.findUserApiKey(user.get().getId());
        HashMap<String, String> map = new HashMap<>();
        map.put("apiKey", apiKey);
        return map;
    }

}
