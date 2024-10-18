BankID and Nexi Payments Integration API

BankID API and Nexi Payments in Java

(Some advices:

    Not optimized for Production environment

    Test were made thought Springboot OpenAPI and Postman. In the files you can find the postman set-up for tests (.json)

    Java truststore in use was downloaded from Bank Demo git page https://github.com/BankID/SampleCode/tree/main/server/certificates/test

    The Nexi certificates were downloaded direct from the test website https://test.api.dibspayment.eu/

)

This project integrates BankID for user authentication and Nexi Payments for payment processing in a Java Spring Boot API. The API enables secure identity verification through BankID and facilitates transactions using Nexi's payment gateway.

It demonstrates the integration of Spring Boot, Swagger (OpenAPI), BankID, and Nexi Payments in a Java-based API. The project also includes WebFlux and other libraries for building a reactive web application. Table of Contents

Project Description
Technologies Used
Prerequisites
Installation
Usage
API Documentation
Contributing
License

Project Description

The SpringSwaggerIntegration project is a demonstration of a Spring Boot application with integrated Swagger/OpenAPI for API documentation, along with support for BankID and Nexi payments. It showcases how to build a reactive web application using Spring WebFlux and how to secure the app with Spring Security. Additionally, the project includes QR code generation using the ZXing library. Key Features:

Spring Boot application with WebFlux and reactive programming.
Swagger/OpenAPI for API documentation.
BankID authentication integration.
Nexi Payments processing.
QR code generation using ZXing.
Security with Spring Security.

Technologies Used

Java 22
Spring Boot 3.3.2
    Spring Boot Starter Data JDBC
    Spring Boot Starter Web
    Spring Boot Starter Security
Swagger/OpenAPI (springdoc-openapi-starter-webmvc-ui)
H2 Database (for development and testing)
WebFlux (for reactive programming)
Netty (used with WebFlux)
ZXing (for QR code generation)
Apache HttpClient5 (for making HTTP requests)
BankID integration libraries
Nexi Payments API integration

Prerequisites

Before you begin, ensure you have the following installed on your machine:

Java 22 or higher
Maven (for dependency management)
Git (for cloning the repository)

Additionally, you will need:

BankID Test Credentials (for BankID integration)
Nexi Payments API Keys (for Nexi payment processing)

Installation

To get started with the project:

Clone the repository:

bash

git clone https://github.com/your-username/SpringSwaggerIntegration.git

Navigate to the project directory:

bash

cd SpringSwaggerIntegration

Install dependencies:

bash

mvn clean install

Set up environment variables or configuration: Update the application.properties file with your BankID and Nexi credentials:

properties
BankID Configuration

bankid.api.base-url=https://test.bankid.com bankid.api.key-store-path=path/to/keystore.p12 bankid.api.key-store-password=yourpassword
Nexi Payment API Configurations

dibs.api.base-url=https://test.api.dibspayment.eu dibs.api.checkout-key=your-checkout-key dibs.api.secret-key=your-secret-key

Run the application:

bash

mvn spring-boot:run

Usage

The application exposes various APIs for testing BankID authentication, Nexi Payments, and QR code generation. After starting the application, you can access the API documentation via Swagger UI. Running Locally

The application will be available at:

arduino

http://localhost:3000

Swagger UI

The Swagger documentation is available at:

bash

http://localhost:3000/swagger-ui.html

API Endpoints

BankID Authentication: /api/authenticate
Nexi Payment: /api/payments/create
QR Code Generation: /api/qrcode/generate

API Documentation

The project uses Swagger/OpenAPI for auto-generated API documentation. You can explore all available endpoints and try them out via the Swagger UI.

To access the Swagger UI, navigate to:

bash

http://localhost:8080/swagger-ui.html

Contributing

If you want to contribute to this project, please follow these steps:

Fork the repository.
Create a new branch (feature/your-feature).
Commit your changes.
Push your branch.
Open a pull request.

License

This project is licensed under the MIT License. See the LICENSE file for details. Feel free to edit or extend this template based on your specific needs or project details.
