package SpringBootSwaggerIntegrator.com.example.SpringSwaggerIntegration.DTOClasses;

import java.util.List;

public class RefundChargeRequestDTO {
    private int amount;
    private List<OrderItem> orderItems;
    private String myReference;

    // Getters and Setters
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

    public String getMyReference() {
        return myReference;
    }

    public void setMyReference(String myReference) {
        this.myReference = myReference;
    }

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

        // Getters and Setters
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
}

