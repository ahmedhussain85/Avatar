package SpringBootSwaggerIntegrator.com.example.SpringSwaggerIntegration;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
public class IpProxyController {

    private final RestTemplate restTemplate;

    public IpProxyController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @CrossOrigin(origins = "http://localhost:3001")
    @GetMapping("/api/get-ip")
    public ResponseEntity<String> getPublicIp() {
        String ipifyUrl = "https://api.ipify.org?format=json";

        try {
            // Make request to ipify API to get the IP address
            String ipResponse = restTemplate.getForObject(ipifyUrl, String.class);
            return ResponseEntity.ok(ipResponse);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching IP address: " + e.getMessage());
        }
    }
}
