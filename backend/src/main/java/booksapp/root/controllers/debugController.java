package booksapp.root.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import booksapp.root.services.debugService;
import booksapp.root.services.userGoogleAuthService;
import booksapp.root.services.userRegisterService;

@RestController
@RequestMapping
public class debugController {
    private final debugService debugService;
    @Autowired // Inject the userService dependency
    public debugController(debugService service) {
        this.debugService = service;
    }

     @GetMapping(value = "/addbooks")
    public String ADD_BOOK_DEBUG() {
        this.debugService.addBook2();
        return "added";
    }
}
