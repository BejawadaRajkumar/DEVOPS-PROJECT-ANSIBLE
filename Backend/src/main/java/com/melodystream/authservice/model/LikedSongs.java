package com.melodystream.authservice.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "liked_songs")
@JsonIgnoreProperties(ignoreUnknown = true)
public class LikedSongs {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userId; // store user ID as string

    @Column(name = "liked_song_ids", columnDefinition = "TEXT")
    @Convert(converter = ListToStringConverter.class)
    private List<String> likedSongIds = new ArrayList<>();

    public LikedSongs() {}

    public LikedSongs(String userId, List<String> likedSongIds) {
        this.userId = userId;
        this.likedSongIds = likedSongIds;
    }

    // Getters & Setters
    public Long getId() {
        return id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public List<String> getLikedSongIds() {
        return likedSongIds;
    }

    public void setLikedSongIds(List<String> likedSongIds) {
        this.likedSongIds = likedSongIds;
    }
}
