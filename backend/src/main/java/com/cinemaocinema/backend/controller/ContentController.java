package com.cinemaocinema.backend.controller;

import com.cinemaocinema.backend.exception.FileNotFoundException;
import com.cinemaocinema.backend.model.Book;
import com.cinemaocinema.backend.model.Image;
import com.cinemaocinema.backend.model.Movie;
import com.cinemaocinema.backend.service.ContentService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ContentController {

    private final ContentService contentService;

    public ContentController(ContentService contentService) {
        this.contentService = contentService;
    }

    @GetMapping("/books")
    public List<Book> getAllBooks() {
        return contentService.getAllBooks();
    }

    @GetMapping("/movies")
    public List<Movie> getAllMovies() {
        return contentService.getAllMovies();
    }

    @GetMapping("/images")
    public Map<String, List<Image>> getAllImages() {
        return contentService.getAllImagesGroupedByFolder();
    }

    @GetMapping("/search")
    public List<Map<String, Object>> searchContent(@RequestParam String query) {
        return contentService.searchContent(query).stream()
                .map(item -> {
                    if (item instanceof Book) {
                        return Map.of("type", "book", "data", item);
                    } else if (item instanceof Movie) {
                        return Map.of("type", "movie", "data", item);
                    } else if (item instanceof Image) {
                        return Map.of("type", "image", "data", item);
                    }
                    return null; // Should not happen
                })
                .collect(Collectors.toList());
    }

    @GetMapping("/content/{type}/{filename:.+}")
    public ResponseEntity<Resource> getContentFile(@PathVariable String type,
                                                   @PathVariable String filename,
                                                   HttpServletRequest request) {
        try {
            Resource resource = contentService.loadFileAsResource(type, filename);
            String contentType = null;
            try {
                contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
            } catch (IOException ex) {
                // fallback to default content type if mime type cannot be determined
                contentType = "application/octet-stream";
            }

            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(resource);
        } catch (FileNotFoundException ex) {
            return ResponseEntity.notFound().build();
        }
    }
}
