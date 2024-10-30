package SpringBootSwaggerIntegrator.com.example.SpringSwaggerIntegration;

import SpringBootSwaggerIntegrator.com.example.SpringSwaggerIntegration.User;
import SpringBootSwaggerIntegrator.com.example.SpringSwaggerIntegration.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public Optional<User> updateUser(Long id, User updatedUser) {
        return userRepository.findById(id).map(user -> {
            user.setPersonNumber(updatedUser.getPersonNumber());
            user.setAvatarInfo(updatedUser.getAvatarInfo());
            user.setHasPaid(updatedUser.isHasPaid());
            return userRepository.save(user);
        });
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}


