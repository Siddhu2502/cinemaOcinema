package com.cinemaocinema.backend.service;

import com.cinemaocinema.backend.model.Book;
import com.cinemaocinema.backend.model.Image;
import com.cinemaocinema.backend.model.Movie;
import com.cinemaocinema.backend.repository.BookRepository;
import com.cinemaocinema.backend.repository.ImageRepository;
import com.cinemaocinema.backend.repository.MovieRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Component
public class DataInitializer implements CommandLineRunner {

    private final BookRepository bookRepository;
    private final MovieRepository movieRepository;
    private final ImageRepository imageRepository;

    public DataInitializer(BookRepository bookRepository, MovieRepository movieRepository, ImageRepository imageRepository) {
        this.bookRepository = bookRepository;
        this.movieRepository = movieRepository;
        this.imageRepository = imageRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        Path storageDirectory = Paths.get("backend", "storage");
        Path booksDir = storageDirectory.resolve("books");
        Path moviesDir = storageDirectory.resolve("movies");
        Path imagesDir = storageDirectory.resolve("images");
        Path imagesFolderADir = imagesDir.resolve("folderA");

        // Create directories
        Files.createDirectories(booksDir);
        Files.createDirectories(moviesDir);
        Files.createDirectories(imagesDir);
        Files.createDirectories(imagesFolderADir);

        System.out.println("Created storage directories at: " + storageDirectory.toAbsolutePath());

        // Create dummy files
        createDummyFile(booksDir, "book1.pdf");
        createDummyFile(booksDir, "book2.txt");
        createDummyFile(moviesDir, "movie1.mp4");
        createDummyFile(moviesDir, "movie2.mkv");
        createDummyFile(imagesDir, "image1.jpg");
        createDummyFile(imagesDir, "image2.png");
        createDummyFile(imagesFolderADir, "imageA1.jpg");
        createDummyFile(imagesFolderADir, "imageA2.gif");

        System.out.println("Created dummy files in storage directories.");

        // Populate database
        if (bookRepository.count() == 0) {
            bookRepository.save(new Book("The Great Gatsby", "F. Scott Fitzgerald", "https://example.com/gatsby.jpg", "books/book1.pdf"));
            bookRepository.save(new Book("To Kill a Mockingbird", "Harper Lee", "https://example.com/mockingbird.jpg", "books/book2.txt"));
            System.out.println("Populated Book data.");
        }

        if (movieRepository.count() == 0) {
            movieRepository.save(new Movie("Inception", "Christopher Nolan", "https://example.com/inception.jpg", "movies/movie1.mp4", "Sci-Fi"));
            movieRepository.save(new Movie("The Shawshank Redemption", "Frank Darabont", "https://example.com/shawshank.jpg", "movies/movie2.mkv", "Drama"));
            System.out.println("Populated Movie data.");
        }

        if (imageRepository.count() == 0) {
            imageRepository.save(new Image("Default Image 1", "images/image1.jpg", null));
            imageRepository.save(new Image("Default Image 2", "images/image2.png", ""));
            imageRepository.save(new Image("Folder A Image 1", "images/folderA/imageA1.jpg", "folderA"));
            imageRepository.save(new Image("Folder A Image 2", "images/folderA/imageA2.gif", "folderA"));
            System.out.println("Populated Image data.");
        }

        System.out.println("Data initialization complete.");
    }

    private void createDummyFile(Path directory, String fileName) throws IOException {
        File file = directory.resolve(fileName).toFile();
        if (!file.exists()) {
            if (file.createNewFile()) {
                System.out.println("Created dummy file: " + file.getAbsolutePath());
            } else {
                System.err.println("Failed to create dummy file: " + file.getAbsolutePath());
            }
        }
    }
}
