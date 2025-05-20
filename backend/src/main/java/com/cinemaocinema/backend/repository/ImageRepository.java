package com.cinemaocinema.backend.repository;

import com.cinemaocinema.backend.model.Image;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ImageRepository extends JpaRepository<Image, Long> {

    List<Image> findByNameContainingIgnoreCase(String name);

    List<Image> findByFolder(String folder);

    List<Image> findByFolderIsNull();
}
