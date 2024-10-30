package SpringBootSwaggerIntegrator.com.example.SpringSwaggerIntegration;

import org.springframework.data.jpa.repository.JpaRepository;
import SpringBootSwaggerIntegrator.com.example.SpringSwaggerIntegration.User;

public interface UserRepository extends JpaRepository<User, Long> {
    // Additional custom queries can be added here if needed.
}

