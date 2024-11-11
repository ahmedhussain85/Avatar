package SpringBootSwaggerIntegrator.com.example.SpringSwaggerIntegration;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.JsonNode;

@RestController
@RequestMapping("/database/users")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @CrossOrigin(origins = "http://localhost:3001")
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @CrossOrigin(origins = "http://localhost:3001")
    @GetMapping("/{personNumber}")
    public ResponseEntity<User> getUserByPersonNumber(@PathVariable String personNumber) {
        return userService.getUserByPersonNumber(personNumber)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @CrossOrigin(origins = "http://localhost:3001")
    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.createUser(user);
    }

    @CrossOrigin(origins = "http://localhost:3001")
    @PutMapping("/{personNumber}")
    public ResponseEntity<User> updateUser(@PathVariable String personNumber, @RequestBody User user) {
        return userService.updateUser(personNumber, user)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{personNumber}")
    public ResponseEntity<Void> deleteUser(@PathVariable String personNumber) {
        userService.deleteUser(personNumber);
        return ResponseEntity.noContent().build();
    }

    @CrossOrigin(origins = "http://localhost:3001")
    @PatchMapping("/{personNumber}/avatarInfo")
    public ResponseEntity<User> updateUserAvatarInfo(@PathVariable String personNumber, @RequestBody JsonNode avatarInfo) {
    Optional<User> userOpt = userService.getUserByPersonNumber(personNumber);
    if (userOpt.isPresent()) {
        User user = userOpt.get();
        // Update only the avatarInfo field
        user.setAvatarInfo(avatarInfo);
        userService.saveUser(user); // Assuming saveUser method is implemented in the service layer
        return ResponseEntity.ok(user);
    } else {
        return ResponseEntity.notFound().build();
    }
}
}