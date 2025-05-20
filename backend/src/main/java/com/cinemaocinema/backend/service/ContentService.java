package com.cinemaocinema.backend.service;

import com.cinemaocinema.backend.exception.FileNotFoundException;
import com.cinemaocinema.backend.model.Book;
import com.cinemaocinema.backend.model.Image;
import com.cinemaocinema.backend.model.Movie;
import com.cinemaocinema.backend.repository.BookRepository;
import com.cinemaocinema.backend.repository.ImageRepository;
import com.cinemaocinema.backend.repository.MovieRepository;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class ContentService {

    private final BookRepository bookRepository;
    private final MovieRepository movieRepository;
    private final ImageRepository imageRepository;
    private final Path storageDirectory = Paths.get("backend", "storage").toAbsolutePath().normalize();

    public ContentService(BookRepository bookRepository, MovieRepository movieRepository, ImageRepository imageRepository) {
        this.bookRepository = bookRepository;
        this.movieRepository = movieRepository;
        this.imageRepository = imageRepository;
    }

    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    public List<Movie> getAllMovies() {
        return movieRepository.findAll();
    }

    public Map<String, List<Image>> getAllImagesGroupedByFolder() {
        Map<String, List<Image>> groupedImages = new HashMap<>();
        List<Image> allImages = imageRepository.findAll();

        for (Image image : allImages) {
            String folder = image.getFolder();
            if (folder == null || folder.trim().isEmpty()) {
                folder = "ALL";
            }
            groupedImages.computeIfAbsent(folder, k -> new ArrayList<>()).add(image);
        }
        return groupedImages;
    }

    public List<Object> searchContent(String keyword) {
        List<Object> results = new ArrayList<>();
        results.addAll(bookRepository.findByTitleContainingIgnoreCase(keyword));
        results.addAll(movieRepository.findByTitleContainingIgnoreCase(keyword));
        results.addAll(imageRepository.findByNameContainingIgnoreCase(keyword));
        return results;
    }

    public Resource loadFileAsResource(String type, String fileName) {
        try {
            Path filePath = this.storageDirectory.resolve(type).resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new FileNotFoundException("File not found or not readable: " + fileName);
            }
        } catch (MalformedURLException ex) {
            throw new FileNotFoundException("File not found (malformed URL): " + fileName, ex);
        }
    }
}
