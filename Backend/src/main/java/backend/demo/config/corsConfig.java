package backend.demo.config;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
@Configuration 
public class corsConfig {


    @Bean 
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") //todos los endpoints del proyecto(controllers)
                        .allowedOrigins("http://localhost:4200") //puerto de angular
                        .allowedMethods("GET", "POST", "PUT", "DELETE") //metodos permitidos
                        .allowedHeaders("*") //habilitia todas las cabeceras
                        .allowCredentials(true); //habilita el envio de credenciales

            }
        };
    }
}
