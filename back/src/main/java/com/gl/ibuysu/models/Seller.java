package com.gl.ibuysu.models;

import java.util.ArrayList;
import java.util.List;
import javax.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Seller extends User {
    @OneToMany(targetEntity=Article.class, mappedBy = "seller")
    @JsonIgnoreProperties("seller")
    private List<Article> articles = new ArrayList<> ();

    @OneToOne(cascade = CascadeType.ALL)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private CreditCard creditCard;

    @OneToOne(cascade = CascadeType.ALL)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private BankCode bankCode;

}
