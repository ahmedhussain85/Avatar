package SpringBootSwaggerIntegrator.com.example.SpringSwaggerIntegration;

import java.util.List;

// Main class for the payment request
public class PaymentRequest {
    private Order order;
    private Checkout checkout;

    // Getters and setters
    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public Checkout getCheckout() {
        return checkout;
    }

    public void setCheckout(Checkout checkout) {
        this.checkout = checkout;
    }

    // Inner class for Order
    public static class Order {
        private List<OrderItem> items;
        private int amount;
        private String currency;
        private String reference;

        // Getters and setters
        public List<OrderItem> getItems() {
            return items;
        }

        public void setItems(List<OrderItem> items) {
            this.items = items;
        }

        public int getAmount() {
            return amount;
        }

        public void setAmount(int amount) {
            this.amount = amount;
        }

        public String getCurrency() {
            return currency;
        }

        public void setCurrency(String currency) {
            this.currency = currency;
        }

        public String getReference() {
            return reference;
        }

        public void setReference(String reference) {
            this.reference = reference;
        }
    }

    // Inner class for OrderItem
    public static class OrderItem {
        private String reference;
        private String name;
        private int quantity;
        private String unit;
        private int unitPrice;
        private int taxRate;
        private int taxAmount;
        private int grossTotalAmount;
        private int netTotalAmount;

        // Getters and setters
        public String getReference() {
            return reference;
        }

        public void setReference(String reference) {
            this.reference = reference;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public int getQuantity() {
            return quantity;
        }

        public void setQuantity(int quantity) {
            this.quantity = quantity;
        }

        public String getUnit() {
            return unit;
        }

        public void setUnit(String unit) {
            this.unit = unit;
        }

        public int getUnitPrice() {
            return unitPrice;
        }

        public void setUnitPrice(int unitPrice) {
            this.unitPrice = unitPrice;
        }

        public int getTaxRate() {
            return taxRate;
        }

        public void setTaxRate(int taxRate) {
            this.taxRate = taxRate;
        }

        public int getTaxAmount() {
            return taxAmount;
        }

        public void setTaxAmount(int taxAmount) {
            this.taxAmount = taxAmount;
        }

        public int getGrossTotalAmount() {
            return grossTotalAmount;
        }

        public void setGrossTotalAmount(int grossTotalAmount) {
            this.grossTotalAmount = grossTotalAmount;
        }

        public int getNetTotalAmount() {
            return netTotalAmount;
        }

        public void setNetTotalAmount(int netTotalAmount) {
            this.netTotalAmount = netTotalAmount;
        }
    }

    // Inner class for Checkout
    public static class Checkout {
        private String integrationType;
        private String returnUrl;
        private String cancelUrl;
        private Consumer consumer;
        private String termsUrl;

        // Getters and setters
        public String getIntegrationType() {
            return integrationType;
        }

        public void setIntegrationType(String integrationType) {
            this.integrationType = integrationType;
        }

        public String getReturnUrl() {
            return returnUrl;
        }

        public void setReturnUrl(String returnUrl) {
            this.returnUrl = returnUrl;
        }

        public String getCancelUrl() {
            return cancelUrl;
        }

        public void setCancelUrl(String cancelUrl) {
            this.cancelUrl = cancelUrl;
        }

        public Consumer getConsumer() {
            return consumer;
        }

        public void setConsumer(Consumer consumer) {
            this.consumer = consumer;
        }

        public String getTermsUrl() {
            return termsUrl;
        }

        public void setTermsUrl(String termsUrl) {
            this.termsUrl = termsUrl;
        }
    }

    // Inner class for Consumer
    public static class Consumer {
        private String email;

        // Getters and setters
        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }
    }
}

