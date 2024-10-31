package SpringBootSwaggerIntegrator.com.example.SpringSwaggerIntegration;

import java.util.Arrays;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;



/*
Probably some docket is needed to filter API Doc and API own information
Old tutorial as reference: https://www.youtube.com/watch?v=8s9I1G4tXhA

Server: http://localhost:8080/ or http://localhost:8080/swagger-ui/index.html#/ or
http://localhost:8080/v3/api-docs
*/

@SpringBootApplication
@EntityScan("SpringBootSwaggerIntegrator.com.example.SpringSwaggerIntegration")
@EnableJpaRepositories("SpringBootSwaggerIntegrator.com.example.SpringSwaggerIntegration")
public class Application {

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}

	//<---This is API Related(Swagger)--->
	@Bean
	public OpenAPI customOpenAPI() {
		return new OpenAPI()
				.info(new Info()
						.title("Custom API")
						.description("This is a custom API description")
						.version("1.0")
						.contact(new Contact().name("API Support").email("pedrostradioto@gmail.com"))
						.license(new License().name("Apache 2.0").url("http://springdoc.org")))
				.externalDocs(new ExternalDocumentation()
						.description("BankID Documentation")
						.url("https://www.bankid.com/en/utvecklare/guider/teknisk-integrationsguide/rp-introduktion")) ;
		//.addTagsItem(new Tag().name("custom-tag").description("This is a custom tag"));
	}
	//<---This is API Related(Swagger)--->

	@Bean
	public CommandLineRunner commandLineRunner(ApplicationContext ctx) {
		return args -> {

			System.out.println("Let's inspect the beans provided by Spring Boot:");

			String[] beanNames = ctx.getBeanDefinitionNames();
			Arrays.sort(beanNames);
			for (String beanName : beanNames) {
				System.out.println(beanName);
			}

		};
	}



}

