package SpringBootSwaggerIntegrator.com.example.SpringSwaggerIntegration;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;



@Service
public class PaymentService {

    @Value("${dibs.api.base-url}")
    private String baseUrl;

    @Value("${dibs.api.create-payment-endpoint}")
    private String createPaymentEndpoint;

    @Value("${dibs.api.get-payment-endpoint}")
    private String paymentEndpoint;

    @Value("${dibs.api.get-charge-endpoint}")
    private String getChargeEndpoint;

    @Value("${dibs.api.get-refund-endpoint}")
    private String getRefundEndpoint;

    @Value("${dibs.api.terminate-endpoint}")
    private String terminateEndpoint;

    @Value("${dibs.api.cancel-pending-endpoint}")
    private String cancelPendingPaymentEndpoint;
    @Value("${dibs.api.cancel-endpoint}")
    private String cancelEndpoint;

    @Value("${dibs.api.myreference-endpoint}")
    private String myReferenceEndpoint;

    @Value("${dibs.api.reference-information-path}")
    private String referenceInformationPathEndPoint;

    //@Value("${dibs.api.order-items-path}")
    //private String updateOrderEndPoint;

    @Value("${dibs.api.cancel-request-endpoint}")
    private String cancelRequestEndPoint;

    
    @Value("${dibs.api.refund-payment-endpoint}")
    private String refundPaymentEndpoint;

    @Value("${dibs.api.charge-payment-endpoint}")
    private String chargePaymentEndpoint;

    @Value("${dibs.api.charge-endpoint}")
    private String chargeEndpoint;
    @Value("${dibs.api.refund-charge-endpoint}")
    private String refundChargeEndpoint;

    @Value("${dibs.api.value-key}")
    private String authorizationKey;

    @Autowired
    private RestTemplate restTemplate;

    private final ObjectMapper objectMapper;

    public PaymentService(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    public String createPayment(PaymentRequest paymentRequest) throws JsonProcessingException {
        String endpoint = baseUrl + createPaymentEndpoint;

        // Create HTTP headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(org.springframework.http.MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + authorizationKey);
        headers.set("CommercePlatformTag", "SOME_STRING_VALUE"); // Replace with actual value if needed

        // Convert payment request to JSON string
        String jsonPayload = objectMapper.writeValueAsString(paymentRequest);

        // Create HTTP request entity
        HttpEntity<String> requestEntity = new HttpEntity<>(jsonPayload, headers);

        // Make the request
        ResponseEntity<String> response = restTemplate.exchange(endpoint, HttpMethod.POST, requestEntity, String.class);

        return response.getBody();
    }

    // New method to retrieve payment details
    public String getPayment(String paymentId) {
        String endpoint = baseUrl + paymentEndpoint + paymentId;

        // Create HTTP headers
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + authorizationKey);
        headers.set("CommercePlatformTag", "SOME_STRING_VALUE"); // Optional, if needed

        // Create the request entity
        HttpEntity<String> requestEntity = new HttpEntity<>(headers);

        // Make the GET request
        ResponseEntity<String> response = restTemplate.exchange(endpoint, HttpMethod.GET, requestEntity, String.class);

        return response.getBody(); // Return the response body (JSON string)
    }

    public String getCharge(String chargeId) {
        String endpoint = baseUrl + getChargeEndpoint + chargeId;

        // Create HTTP headers
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + authorizationKey);
        headers.set("CommercePlatformTag", "SOME_STRING_VALUE"); // Optional, if needed

        // Create the request entity
        HttpEntity<String> requestEntity = new HttpEntity<>(headers);

        // Make the GET request
        ResponseEntity<String> response = restTemplate.exchange(endpoint, HttpMethod.GET, requestEntity, String.class);

        return response.getBody(); // Return the response body (JSON string)
    }

    public String getRefund(String refundId) {
        String endpoint = baseUrl + getRefundEndpoint + refundId;

        // Create HTTP headers
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + authorizationKey);
        headers.set("CommercePlatformTag", "SOME_STRING_VALUE"); // Optional, if needed

        // Create the request entity
        HttpEntity<String> requestEntity = new HttpEntity<>(headers);

        // Make the GET request
        ResponseEntity<String> response = restTemplate.exchange(endpoint, HttpMethod.GET, requestEntity, String.class);

        return response.getBody(); // Return the response body (JSON string)
    }

    public String terminatePayment(String paymentId) {
        // Construct the endpoint for the terminate request
        String endpoint = baseUrl + paymentEndpoint + paymentId + terminateEndpoint;

        // Create HTTP headers
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + authorizationKey);
        headers.set("CommercePlatformTag", "SOME_STRING_VALUE"); // Optional, if needed

        // Create the request entity with headers only (no body is required for this PUT)
        HttpEntity<String> requestEntity = new HttpEntity<>(headers);

        // Make the PUT request to terminate the payment
        ResponseEntity<String> response = restTemplate.exchange(endpoint, HttpMethod.PUT, requestEntity, String.class);

        return response.getBody(); // Return the response body (JSON string)
    }

    public String cancelPendingRefund(String refundId) {
        // Construct the endpoint for the terminate request
        String endpoint = baseUrl + cancelPendingPaymentEndpoint + refundId + cancelEndpoint;

        // Create HTTP headers
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + authorizationKey);
        headers.set("CommercePlatformTag", "SOME_STRING_VALUE"); // Optional, if needed

        // Create the request entity with headers only (no body is required for this PUT)
        HttpEntity<String> requestEntity = new HttpEntity<>(headers);

        // Make the PUT request to terminate the payment
        ResponseEntity<String> response = restTemplate.exchange(endpoint, HttpMethod.PUT, requestEntity, String.class);

        return response.getBody(); // Return the response body (JSON string)
    }

    public String updateMyReference(String paymentId, String myReference) 
    {
    // Construct the endpoint for the update request
    String endpoint = baseUrl + paymentEndpoint + paymentId + myReferenceEndpoint;

    // Create HTTP headers
    HttpHeaders headers = new HttpHeaders();
    headers.set("Authorization", "Bearer " + authorizationKey);
    headers.set("CommercePlatformTag", "SOME_STRING_VALUE"); // Optional, if needed
    headers.setContentType(org.springframework.http.MediaType.APPLICATION_JSON);

    // Create the request body
    Map<String, String> body = new HashMap<>();
    body.put("myReference", myReference);

    // Create the request entity with headers and body
    HttpEntity<Map<String, String>> requestEntity = new HttpEntity<>(body, headers);

    // Make the PUT request
    ResponseEntity<String> response = restTemplate.exchange(endpoint, HttpMethod.PUT, requestEntity, String.class);

    return response.getBody(); // Return the response body (JSON string)
    }
    

    public String updateReferenceInformation(String paymentId, ReferenceInformationDTO referenceInformationDTO) throws JsonProcessingException {
    String endpoint = baseUrl + paymentEndpoint + paymentId + referenceInformationPathEndPoint;

    // Create HTTP headers
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    headers.set("Authorization", "Bearer " + authorizationKey);
    headers.set("CommercePlatformTag", "SOME_STRING_VALUE");

    // Convert DTO to JSON
    String jsonPayload = objectMapper.writeValueAsString(referenceInformationDTO);

    // Create the request entity
    HttpEntity<String> requestEntity = new HttpEntity<>(jsonPayload, headers);

    // Make the PUT request
    ResponseEntity<String> response = restTemplate.exchange(endpoint, HttpMethod.PUT, requestEntity, String.class);

    return response.getBody();
    }

    public String cancelPaymentRequest(String paymentId, CancelPaymentRequestDTO cancelPaymentRequestDTO) {
    String endpoint = baseUrl + paymentEndpoint + paymentId + cancelRequestEndPoint;

    // Create HTTP headers
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    headers.set("Authorization", "Bearer " + authorizationKey);

    // Add the DTO as the request body
    HttpEntity<CancelPaymentRequestDTO> requestEntity = new HttpEntity<>(cancelPaymentRequestDTO, headers);

    // Make the POST request with the body included
    ResponseEntity<String> response = restTemplate.exchange(endpoint, HttpMethod.POST, requestEntity, String.class);

    return response.getBody();
}

public String refundPaymentRequest(String paymentId, RefundPaymentRequestDTO refundPaymentRequestDTO) {
    String endpoint = baseUrl + paymentEndpoint + paymentId + refundPaymentEndpoint;

    // Create HTTP headers
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    headers.set("Authorization", "Bearer " + authorizationKey);

    // Create HTTP entity
    HttpEntity<RefundPaymentRequestDTO> requestEntity = new HttpEntity<>(refundPaymentRequestDTO, headers);

    // Make the POST request to refund the payment
    ResponseEntity<String> response = restTemplate.exchange(endpoint, HttpMethod.POST, requestEntity, String.class);

    return response.getBody();
}



public String chargePaymentRequest(String paymentId, ChargePaymentRequestDTO chargePaymentRequestDTO) {
    String endpoint = baseUrl + paymentEndpoint + paymentId + chargePaymentEndpoint;

    // Create HTTP headers
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    headers.set("Authorization", "Bearer " + authorizationKey);

    // Create HTTP entity
    HttpEntity<ChargePaymentRequestDTO> requestEntity = new HttpEntity<>(chargePaymentRequestDTO, headers);

    // Make the POST request to charge the payment
    ResponseEntity<String> response = restTemplate.exchange(endpoint, HttpMethod.POST, requestEntity, String.class);

    return response.getBody();
}

public String refundCharge(String chargeId, RefundChargeRequestDTO refundChargeRequestDTO) {
    String endpoint = baseUrl + chargeEndpoint + chargeId + refundChargeEndpoint;

    // Create HTTP headers
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    headers.set("Authorization", "Bearer " + authorizationKey);

    // Create HTTP entity
    HttpEntity<RefundChargeRequestDTO> requestEntity = new HttpEntity<>(refundChargeRequestDTO, headers);

    // Make the POST request to refund the charge
    ResponseEntity<String> response = restTemplate.exchange(endpoint, HttpMethod.POST, requestEntity, String.class);

    return response.getBody();
}




}






