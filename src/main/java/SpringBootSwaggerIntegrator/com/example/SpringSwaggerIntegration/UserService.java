package SpringBootSwaggerIntegrator.com.example.SpringSwaggerIntegration;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserByPersonNumber(String personNumber) {
        return userRepository.findByPersonNumber(personNumber);
    }

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public Optional<User> updateUser(String personNumber, User updatedUser) {
        return userRepository.findByPersonNumber(personNumber).map(user -> {
            user.setPersonNumber(updatedUser.getPersonNumber());
            user.setAvatarInfo(updatedUser.getAvatarInfo());
            user.setHasPaid(updatedUser.isHasPaid());
            user.setUserType(updatedUser.getUserType());
            user.setHasLicense(updatedUser.isHasLicense());
            return userRepository.save(user);
        });
    }

    public void deleteUser(String personNumber) {
        userRepository.deleteByPersonNumber(personNumber);
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }
}
