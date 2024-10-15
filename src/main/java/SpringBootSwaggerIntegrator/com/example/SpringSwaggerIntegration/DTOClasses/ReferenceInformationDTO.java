package SpringBootSwaggerIntegrator.com.example.SpringSwaggerIntegration.DTOClasses;

import java.util.List;

public class ReferenceInformationDTO {
    private int amount;
    private List<OrderItem> items;
    private Shipping shipping;
    private List<PaymentMethod> paymentMethods;

    // Getters and setters
    public int getAmount() {
        return amount;
    }

    public void setAmount(int amount) {
        this.amount = amount;
    }

    public List<OrderItem> getItems() {
        return items;
    }

    public void setItems(List<OrderItem> items) {
        this.items = items;
    }

    public Shipping getShipping() {
        return shipping;
    }

    public void setShipping(Shipping shipping) {
        this.shipping = shipping;
    }

    public List<PaymentMethod> getPaymentMethods() {
        return paymentMethods;
    }

    public void setPaymentMethods(List<PaymentMethod> paymentMethods) {
        this.paymentMethods = paymentMethods;
    }

    // Nested classes

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

    public static class Shipping {
        private boolean costSpecified;

        // Getters and setters
        public boolean isCostSpecified() {
            return costSpecified;
        }

        public void setCostSpecified(boolean costSpecified) {
            this.costSpecified = costSpecified;
        }
    }

    public static class PaymentMethod {
        private String name;
        private Fee fee;

        // Getters and setters
        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public Fee getFee() {
            return fee;
        }

        public void setFee(Fee fee) {
            this.fee = fee;
        }

        public static class Fee {
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
}

