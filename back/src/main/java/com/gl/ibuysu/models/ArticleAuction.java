package com.gl.ibuysu.models;

import java.util.Date;
import javax.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class ArticleAuction extends Article {
    private int duration;

    private Date addedAt;

    private Date limitDate;

}
