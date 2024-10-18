package SpringBootSwaggerIntegrator.com.example.SpringSwaggerIntegration.BankID;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URISyntaxException;
import java.time.Instant;
import java.util.Base64;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import javax.imageio.ImageIO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.google.zxing.WriterException;

import io.swagger.v3.oas.annotations.Operation;

@RestController
public class BankIDController {
    
    private final ExecutorService executorService = Executors.newSingleThreadExecutor();

    @Autowired
    private BankIDService bankIDService;
    
    @Operation(summary = "Get example data", description = "This method returns example data.")
    @GetMapping("/")
    public String index() {
        return "Greetings from Spring Boot!";
    }

    @CrossOrigin(origins = "http://localhost:3001")
    @Operation(summary = "Start authentication", description = "This method returns data from BankID after contacting /auth end point")
    @PostMapping("/authenticate") // /auth
    public String authenticate(@RequestBody Map<String, Object> userData) throws IOException, URISyntaxException {
        return bankIDService.authenticate(userData);
    }

    @CrossOrigin(origins = "http://localhost:3001")
    @Operation(summary = "Verify process status", description = "Checks process status each 2 seconds after contacting /collect end point.")
    @PostMapping("/status")
    public String checkStatus(@RequestBody Map<String, String> orderData) throws JsonProcessingException, InterruptedException {
        String orderRef = orderData.get("orderRef");
        if (orderRef == null || orderRef.isEmpty()) { //error handling
            throw new IllegalArgumentException("OrderRef is required");
        }
        //System.out.println("orderRef from status: " + orderRef);
        return bankIDService.pollCollect(orderRef);
    }

    @Operation(summary = "Cancel on going process", description = "Cancels on going process after contacting /cancel end point. Returns an empty Json.")
    @PostMapping("/cancel")
    public String cancelOrder(@RequestBody Map<String, String> orderData) throws JsonProcessingException {
        String orderRef = orderData.get("orderRef");
        if (orderRef == null || orderRef.isEmpty()) {
            throw new IllegalArgumentException("OrderRef is required");
        }
        return bankIDService.cancelOrder(orderRef);
    }

    @Operation(summary = "Start authentication with phone", description = "This method returns data from BankID after contacting /phone/auth end point.")
    @PostMapping("/phone/auth")
    public String authenticateOverPhone(@RequestBody Map<String, Object> phoneAuthData) throws IOException, URISyntaxException {
        return bankIDService.authenticateOverPhone(phoneAuthData);
    }

    @PostMapping("/phone/sign")
    public String signOverPhone(@RequestBody Map<String, Object> phoneData) throws IOException, URISyntaxException {
        return bankIDService.signOverPhone(phoneData);
    }

    @PostMapping("/sign")
    public String signDoc(@RequestBody Map<String, Object> data) throws IOException, URISyntaxException {
        return bankIDService.signDoc(data);
    }

    @CrossOrigin(origins = "http://localhost:3001")
    @GetMapping(value = "/generateQrCode", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter generateQrCode(@RequestParam String qrStartToken, @RequestParam String qrStartSecret) {
        SseEmitter emitter = new SseEmitter(31000L); // 31 seconds timeout
        Instant orderTime = Instant.now();

        executorService.execute(() -> {
            try {
                bankIDService.generateAnimatedQrCode(qrStartToken, qrStartSecret, orderTime, emitter);
            } catch (Exception ex) {
                emitter.completeWithError(ex);
            }
        });

        return emitter;
    }

    
    @GetMapping("/getQrCodeImage")
    public String getQrCodeImage(@RequestParam String qrData) throws IOException, WriterException {
        BufferedImage qrCodeImage = bankIDService.generateQrCodeImage(qrData);

        // Convert BufferedImage to Base64 string to return
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(qrCodeImage, "png", baos);
        String base64Image = Base64.getEncoder().encodeToString(baos.toByteArray());

        // Return the image as a base64 encoded string (this can be embedded in HTML <img> tag)
        return base64Image;
    }

    @CrossOrigin(origins = "http://localhost:3001")
    @PostMapping("/generateBankIDUrl")
    public String generateBankIDUrl(@RequestBody Map<String, String> requestData) throws UnsupportedEncodingException {
        String autoStartToken = requestData.get("autoStartToken");
        String returnUrl = requestData.get("returnUrl");
        return bankIDService.generateBankIDUrl(autoStartToken, returnUrl);
    }

    @PostMapping("/generateMobileBankIDUrl")
    public String generateMobileBankIDUrl(@RequestBody Map<String, String> requestData) throws UnsupportedEncodingException {
        String autoStartToken = requestData.get("autoStartToken");
        String returnUrl = requestData.get("returnUrl");
        return bankIDService.generateMobileBankIDUrl(autoStartToken, returnUrl);
    }
}

