package SpringBootSwaggerIntegrator.com.example.SpringSwaggerIntegration;

import javax.persistence.*;
import org.hibernate.annotations.Type;
import com.fasterxml.jackson.databind.JsonNode;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "person_number", unique = true, nullable = false)
    private String personNumber;

    @Type(type = "jsonb")
    @Column(columnDefinition = "jsonb")
    private JsonNode avatarInfo;

    @Column(name = "has_paid", nullable = false)
    private boolean hasPaid;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPersonNumber() {
        return personNumber;
    }

    public void setPersonNumber(String personNumber) {
        this.personNumber = personNumber;
    }

    public JsonNode getAvatarInfo() {
        return avatarInfo;
    }

    public void setAvatarInfo(JsonNode avatarInfo) {
        this.avatarInfo = avatarInfo;
    }

    public boolean isHasPaid() {
        return hasPaid;
    }

    public void setHasPaid(boolean hasPaid) {
        this.hasPaid = hasPaid;
    }
}


