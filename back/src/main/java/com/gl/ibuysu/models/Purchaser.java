package com.gl.ibuysu.models;

import java.util.ArrayList;
import java.util.List;
import javax.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Purchaser extends User {
    @OneToMany
    @JsonIgnoreProperties("purchaser")
    private List<Article> articles = new ArrayList<> ();

    @OneToMany
    private List<Auction> auctions = new ArrayList<> ();

}
