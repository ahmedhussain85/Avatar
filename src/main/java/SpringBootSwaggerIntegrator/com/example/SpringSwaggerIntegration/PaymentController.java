package SpringBootSwaggerIntegrator.com.example.SpringSwaggerIntegration;


import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;


@CrossOrigin(origins = "http://localhost:3001")
@RestController
@RequestMapping("/api")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @CrossOrigin(origins = "http://localhost:3001")
    @PostMapping("/createpayment")
    public ResponseEntity<String> createPayment(
        @RequestBody PaymentRequest paymentRequest) {
        try {
            String response = paymentService.createPayment(paymentRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error creating payment: " + e.getMessage());
        }
    }

    // New endpoint to retrieve payment details
    @GetMapping("/payments/{paymentId}")
    public ResponseEntity<String> getPayment(@PathVariable String paymentId) {
        try {
            String response = paymentService.getPayment(paymentId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error retrieving payment details: " + e.getMessage());
        }
    }

    @GetMapping("/charges/{chargeId}")
    public ResponseEntity<String> getCharge(@PathVariable String chargeId) {
        try {
            String response = paymentService.getCharge(chargeId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error retrieving payment details: " + e.getMessage());
        }
    }

    @GetMapping("/refunds/{refundId}")
    public ResponseEntity<String> getRefund(@PathVariable String refundId) {
        try {
            String response = paymentService.getRefund(refundId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error retrieving payment details: " + e.getMessage());
        }
    }

    @PutMapping("/payments/{paymentId}/terminate")
    public ResponseEntity<String> terminatePayment(@PathVariable String paymentId) {
        try {
            String response = paymentService.terminatePayment(paymentId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error terminating payment: " + e.getMessage());
        }
    }

    @PostMapping("/refunds/{refundId}/cancel")
    public ResponseEntity<String> cancelPendingRefund(@PathVariable String refundId) {
        try {
            String response = paymentService.terminatePayment(refundId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error terminating payment: " + e.getMessage());
        }
    }

    @PutMapping("/payments/{paymentId}/myreference") 
    public ResponseEntity<String> updateMyReference(
    @PathVariable String paymentId, 
    @RequestBody Map<String, String> body) 
    {
    try {
        String myReference = body.get("myReference");
        String response = paymentService.updateMyReference(paymentId, myReference);
        return ResponseEntity.ok(response);
    } catch (Exception e) {
        return ResponseEntity.status(500).body("Error updating myReference: " + e.getMessage());
    }
    }

    @PutMapping("/payments/{paymentId}/referenceinformation") 
    public ResponseEntity<String> updateReferenceInformation(
    @PathVariable String paymentId, 
    @RequestBody Map<String, String> body) 
    {
    try {
        String myReference = body.get("reference");
        String response = paymentService.updateMyReference(paymentId, myReference);
        return ResponseEntity.ok(response);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body("Error updating reference information: " + e.getMessage());
    }
    }
    
    @PutMapping("/payments/{paymentId}/updateorder")
    public ResponseEntity<String> updateReferenceInformation(
    @PathVariable String paymentId, 
    @RequestBody ReferenceInformationDTO referenceInformationDTO) {
    try {
        String response = paymentService.updateReferenceInformation(paymentId, referenceInformationDTO);
        return ResponseEntity.ok(response);
    } catch (Exception e) {
        return ResponseEntity.status(500).body("Error updating reference information: " + e.getMessage());
    }
    }

    @PostMapping("/payments/{paymentId}/cancels")
    public ResponseEntity<String> cancelPaymentRequest(
    @PathVariable String paymentId, 
    @Valid @RequestBody CancelPaymentRequestDTO cancelPaymentRequestDTO) {
    try {
        String response = paymentService.cancelPaymentRequest(paymentId, cancelPaymentRequestDTO);
        return ResponseEntity.ok(response);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                             .body("Error canceling payment: " + e.getMessage());
    }
    }

    @PostMapping("/payments/{paymentId}/refunds")
    public ResponseEntity<String> refundPaymentRequest(
    @PathVariable String paymentId, 
    @Valid @RequestBody RefundPaymentRequestDTO refundPaymentRequestDTO) {
    try {
        String response = paymentService.refundPaymentRequest(paymentId, refundPaymentRequestDTO);
        return ResponseEntity.ok(response);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                             .body("Error refunding payment: " + e.getMessage());
    }
    }
    
    @PostMapping("/payments/{paymentId}/charges")
    public ResponseEntity<String> chargePaymentRequest(
    @PathVariable String paymentId, 
    @Valid @RequestBody ChargePaymentRequestDTO chargePaymentRequestDTO) {
    try {
        String response = paymentService.chargePaymentRequest(paymentId, chargePaymentRequestDTO);
        return ResponseEntity.ok(response);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                             .body("Error charging payment: " + e.getMessage());
    }
    }

    @PostMapping("/charges/{chargeId}/refunds")
    public ResponseEntity<String> refundCharge(
            @PathVariable String chargeId, 
            @Valid @RequestBody RefundChargeRequestDTO refundChargeRequestDTO) {
        try {
            String response = paymentService.refundCharge(chargeId, refundChargeRequestDTO);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Error processing refund request: " + e.getMessage());
        }
    }

}



