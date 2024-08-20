package SpringBootSwaggerIntegrator.com.example.SpringSwaggerIntegration;


import io.swagger.v3.oas.annotations.Operation;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class HelloController {

    @Operation(summary = "Get example data", description = "This method returns example data.")
    @GetMapping("/")
    public String index() {
        return "Greetings from Spring Boot! mod";
    }
}
