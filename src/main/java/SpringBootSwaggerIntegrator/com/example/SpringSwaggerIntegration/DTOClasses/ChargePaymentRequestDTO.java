package SpringBootSwaggerIntegrator.com.example.SpringSwaggerIntegration.DTOClasses;

import java.util.List;

public class ChargePaymentRequestDTO {

    private int amount;
    private List<OrderItem> orderItems;
    private Shipping shipping;
    private boolean finalCharge;
    private String myReference;
    private String paymentMethodReference;

    // Getters and setters for ChargePaymentRequestDTO
    public int getAmount() {
        return amount;
    }

    public void setAmount(int amount) {
        this.amount = amount;
    }

    public List<OrderItem> getOrderItems() {
        return orderItems;
    }

    public void setOrderItems(List<OrderItem> orderItems) {
        this.orderItems = orderItems;
    }

    public Shipping getShipping() {
        return shipping;
    }

    public void setShipping(Shipping shipping) {
        this.shipping = shipping;
    }

    public boolean isFinalCharge() {
        return finalCharge;
    }

    public void setFinalCharge(boolean finalCharge) {
        this.finalCharge = finalCharge;
    }

    public String getMyReference() {
        return myReference;
    }

    public void setMyReference(String myReference) {
        this.myReference = myReference;
    }

    public String getPaymentMethodReference() {
        return paymentMethodReference;
    }

    public void setPaymentMethodReference(String paymentMethodReference) {
        this.paymentMethodReference = paymentMethodReference;
    }

    // Nested OrderItem class
    public static class OrderItem {
        private String reference;
        private String name;
        private double quantity;
        private String unit;
        private int unitPrice;
        private int taxRate;
        private int taxAmount;
        private int grossTotalAmount;
        private int netTotalAmount;
        private String imageUrl;

        // Getters and setters for OrderItem
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

        public double getQuantity() {
            return quantity;
        }

        public void setQuantity(double quantity) {
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

        public String getImageUrl() {
            return imageUrl;
        }

        public void setImageUrl(String imageUrl) {
            this.imageUrl = imageUrl;
        }
    }

    // Nested Shipping class
    public static class Shipping {
        private String trackingNumber;
        private String provider;

        // Getters and setters for Shipping
        public String getTrackingNumber() {
            return trackingNumber;
        }

        public void setTrackingNumber(String trackingNumber) {
            this.trackingNumber = trackingNumber;
        }

        public String getProvider() {
            return provider;
        }

        public void setProvider(String provider) {
            this.provider = provider;
        }
    }
}

       

