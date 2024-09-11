package SpringBootSwaggerIntegrator.com.example.SpringSwaggerIntegration;

import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.awt.*;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Map;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.awt.image.BufferedImage;
import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import org.springframework.stereotype.Service;
import java.io.ByteArrayOutputStream;
import java.util.EnumMap;

@Service
public class BankIDService {

    @Autowired
    private RestTemplate restTemplate;

    @Value("${bankid.api.base-url}")
    private String baseUrl;

    @Value("${bankid.api.auth-endpoint}")
    private String authEndpoint;

    @Autowired
    private ObjectMapper objectMapper;

    @Value("${bankid.api.phone-auth-endpoint}")
    private String phoneAuthEndpoint;

    @Value("${bankid.api.sign-endpoint}")
    private String signEndpoint;

    @Value("${bankid.api.phone-sign-endpoint}")
    private String phoneSignEndpoint;

    @Value("${bankid.api.collect-endpoint}")
    private String collectEndpoint;

    @Value("${bankid.api.cancel-endpoint}")
    private String cancelEndpoint;

    public String authenticate(Map<String, Object> userData) throws IOException, URISyntaxException {
        String jsonPayload = objectMapper.writeValueAsString(userData);
        String url = baseUrl + authEndpoint;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> request = new HttpEntity<>(jsonPayload, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

        /*//Test
        Desktop desktop = Desktop.getDesktop();
        URI uri = new URI("http://www.google.com");
        desktop.browse(uri);
        //Test*/

        return response.getBody();
    }


    //When called uses /status to verify Status "of an ongoing authentication or signing process" every 2 seconds.
    public String pollCollect(String orderRef) throws JsonProcessingException, InterruptedException {
        String status = "pending";
        String responseBody = "";

        while ("pending".equalsIgnoreCase(status)) {
            String url = baseUrl + collectEndpoint;

            Map<String, String> requestBody = Map.of("orderRef", orderRef);
            String jsonPayload = objectMapper.writeValueAsString(requestBody);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<String> request = new HttpEntity<>(jsonPayload, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
            responseBody = response.getBody();

            // Extract status from response JSON
            status = objectMapper.readTree(responseBody).path("status").asText();

            if ("complete".equalsIgnoreCase(status) || "failed".equalsIgnoreCase(status)) {
                break;
            }

            // Add a condition to check for a canceled status or the result of a cancellation
            String hintCode = objectMapper.readTree(responseBody).path("hintCode").asText();
            if ("cancelled".equalsIgnoreCase(hintCode) || responseBody.contains("Order cancelled successfully")) {
                System.out.println("Order has been cancelled, stopping polling.");
                break;
            }

            System.out.println("Response Body: " + responseBody);
            System.out.println("Status from pool: " + status);
            Thread.sleep(2000); // Sleep for 2 seconds before the next poll
        }

        return responseBody;
    }

    public String cancelOrder(String orderRef) throws JsonProcessingException {
        String url = baseUrl + cancelEndpoint;

        Map<String, String> requestBody = Map.of("orderRef", orderRef);
        String jsonPayload = objectMapper.writeValueAsString(requestBody);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> request = new HttpEntity<>(jsonPayload, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

        // Since the response is expected to be an empty JSON object, we can return a success message
        if (response.getStatusCode().is2xxSuccessful()) {
            System.out.println("Order cancelled successfully");
            return "Order cancelled successfully";
        } else {
            System.out.println("Failed to cancel the order");
            return "Failed to cancel the order";
        }

    }

    public String authenticateOverPhone(Map<String, Object> phoneAuthData) throws IOException, URISyntaxException {
        String jsonPayload = objectMapper.writeValueAsString(phoneAuthData);
        String url = baseUrl + phoneAuthEndpoint;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> request = new HttpEntity<>(jsonPayload, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

        return response.getBody();
    }

    public String signOverPhone(Map<String, Object> phoneData) throws IOException, URISyntaxException {
        String jsonPayload = objectMapper.writeValueAsString(phoneData);
        String url = baseUrl + phoneSignEndpoint;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> request = new HttpEntity<>(jsonPayload, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

        return response.getBody();
    }

    public String signDoc(Map<String, Object> data) throws IOException, URISyntaxException {
        String jsonPayload = objectMapper.writeValueAsString(data);
        String url = baseUrl + signEndpoint;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> request = new HttpEntity<>(jsonPayload, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

        return response.getBody();
    }


    //
    // Generate HMACSHA256 for qrAuthCode
    private String generateQrAuthCode(String qrStartSecret, String qrTime) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(qrStartSecret.getBytes(StandardCharsets.US_ASCII), "HmacSHA256"));
        mac.update(qrTime.getBytes(StandardCharsets.US_ASCII));
        return String.format("%064x", new BigInteger(1, mac.doFinal()));
    }

    // Generate QR Code Data
    private String generateQrData(String qrStartToken, String qrStartSecret, Instant orderTime) throws Exception {
        String qrTime = Long.toString(orderTime.until(Instant.now(), ChronoUnit.SECONDS));
        String qrAuthCode = generateQrAuthCode(qrStartSecret, qrTime);
        return String.join(".", "bankid", qrStartToken, qrTime, qrAuthCode);
    }

    // Generate QR Code Image
    public BufferedImage generateQrCodeImage(String qrData) throws WriterException {
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(qrData, BarcodeFormat.QR_CODE, 300, 300);

        // Customizing QR Code with low error correction
        Map<EncodeHintType, Object> hints = new EnumMap<>(EncodeHintType.class);
        hints.put(EncodeHintType.ERROR_CORRECTION, "L");
        System.out.println("Generated QR Code Data: " + qrData);
        return MatrixToImageWriter.toBufferedImage(bitMatrix);
    }

    // Method to continuously update QR code every second
    public String generateAnimatedQrCode(String qrStartToken, String qrStartSecret, Instant orderTime) throws Exception {
        while (orderTime.until(Instant.now(), ChronoUnit.SECONDS) < 30) {
            String qrData = generateQrData(qrStartToken, qrStartSecret, orderTime);
            BufferedImage qrCodeImage = generateQrCodeImage(qrData);
            // Logic to stream or update the QR code on the front-end
            // This can be extended based on how you intend to serve it (e.g., via WebSocket or similar)

            // Wait 1 second before generating a new QR code
            Thread.sleep(3000);
        }
        return "QR code expired after 30 seconds.";
    }
    public String generateBankIDUrl(String autoStartToken, String returnUrl) throws UnsupportedEncodingException {
        String encodedReturnUrl = URLEncoder.encode(returnUrl, StandardCharsets.UTF_8.toString());
        System.out.println("Generated URL: " + "bankid:///?autostarttoken=" + autoStartToken + "&redirect=" + encodedReturnUrl);
        return "bankid:///?autostarttoken=" + autoStartToken + "&redirect=" + encodedReturnUrl;
    }

    public String generateMobileBankIDUrl(String autoStartToken, String returnUrl) throws UnsupportedEncodingException {
        String encodedReturnUrl = URLEncoder.encode(returnUrl, StandardCharsets.UTF_8.toString());
        return "https://app.bankid.com/?autostarttoken=" + autoStartToken + "&redirect=" + encodedReturnUrl;
    }
}