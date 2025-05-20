# cinemaOcinema Application - Setup and Running Instructions

## 1. Project Overview

A brief description of the application: "cinemaOcinema allows users to search for and access books, movies, and images. It features a React Native (Expo) frontend and a Java (Spring Boot) backend."

Mention the main directory structure:
- `/backend`: Contains the Java Spring Boot backend.
- `/frontend`: Contains the React Native (Expo) frontend.
- `/storage` (within `/backend/src/main/resources/` or created at `backend/storage`): Contains sample media files. This directory is created and populated at `backend/storage` when the backend runs for the first time by the `DataInitializer` service.

## 2. Backend Setup (Java - Spring Boot)

### Prerequisites
- Java JDK 17 or higher
- Apache Maven (e.g., 3.8.x or higher)

### Running the Backend
1.  Navigate to the `backend` directory: `cd backend`
2.  Build the project using Maven: `mvn clean install` (or `mvn spring-boot:run` directly if you prefer, but a build is good practice).
3.  Run the Spring Boot application: `java -jar target/backend-1.0-SNAPSHOT.jar` (JAR name `backend-1.0-SNAPSHOT.jar` is based on `pom.xml`).
    *   Alternatively, after building, you can run using the Maven Spring Boot plugin: `mvn spring-boot:run`.
4.  The backend will start on `http://localhost:8080`.

### Database (H2 In-Memory)
- The application uses an H2 in-memory database.
- **H2 Console:** You can access the H2 console to view the database schema and data at: `http://localhost:8080/h2-console`
    - **JDBC URL:** `jdbc:h2:mem:cinemadb`
    - **User Name:** `sa`
    - **Password:** `password`
- **Sample Data:** Sample data for books, movies, and images is automatically inserted when the application starts, facilitated by the `DataInitializer` service. This also creates dummy media files in `backend/storage/`.

## 3. Frontend Setup (React Native - Expo)

### Prerequisites
- Node.js (e.g., LTS version like 18.x or 20.x)
- npm (comes with Node.js)
- Expo CLI (if not using local Expo Go app for development): `npm install -g expo-cli` (though `npx expo` commands are generally preferred now and work without global install).
- A mobile device with the Expo Go app or an Android/iOS emulator/simulator.

### Running the Frontend
1.  Navigate to the `frontend` directory: `cd frontend`
2.  Install dependencies: `npm install`
3.  Start the Expo development server: `npm start` (which runs `expo start`).
4.  Follow the instructions in the terminal:
    *   Scan the QR code with the Expo Go app on your mobile device.
    *   Or, press `a` for Android emulator or `i` for iOS simulator if they are set up.
    *   Or, press `w` to open in web browser (though the primary target is mobile/TV).

## 4. Superuser Credentials

The application has a pre-configured superuser for login:
- **Username:** `siddharth`
- **Password:** `Best#123`
(Note: This is an in-memory user defined in `SecurityConfig.java` for development purposes. The password "Best#123" is for the `AuthService` hardcoded check, while the Spring Security user uses an encoded version of this.)

## 5. Adding New Content (Manual Guide)

The application's sample content is initialized by the `DataInitializer` service, which creates dummy files and database entries. To manually add more content after initial setup:

1.  **Place Content Files:**
    *   **Books:** Add PDF/EPUB files to `backend/storage/books/`.
    *   **Movies:** Add MP4/other movie files to `backend/storage/movies/`.
    *   **Images:** Add image files (JPG, PNG, GIF, etc.) directly to `backend/storage/images/` or into new subfolders within `backend/storage/images/` (e.g., `backend/storage/images/MyFolder/`).
2.  **Update Database (Manual - via H2 Console for now):**
    *   After placing the files, you would typically need to add corresponding entries into the `BOOK`, `MOVIE`, or `IMAGE` tables in the H2 database.
    *   You can do this via the H2 Console (`http://localhost:8080/h2-console`).
    *   **Example SQL Insert for a new image (with H2 auto-generated ID):**
        ```sql
        -- For tables with IDENTITY columns like BOOK, MOVIE, IMAGE, H2 generates ID automatically.
        -- Do not include the ID column in the INSERT statement or set it to NULL (depending on exact H2 mode).
        INSERT INTO IMAGE (NAME, FILE_PATH, FOLDER) VALUES ('My New Image', 'MyFolder/my_new_image.jpg', 'MyFolder');
        
        -- If you needed to specify an ID (e.g., if IDENTITY strategy was not used, or for specific cases), 
        -- and if a sequence named 'IMAGE_SEQ' was defined, the syntax would be:
        -- INSERT INTO IMAGE (ID, NAME, FILE_PATH, FOLDER) VALUES (NEXT VALUE FOR IMAGE_SEQ, 'My New Image', 'MyFolder/my_new_image.jpg', 'MyFolder');
        ```
    *   Ensure `FILE_PATH` is relative to the respective content type's base directory within `backend/storage/` (e.g., for an image at `backend/storage/images/MyFolder/my_new_image.jpg`, the `FILE_PATH` in the `IMAGE` table would be `MyFolder/my_new_image.jpg`. For an image at `backend/storage/images/another.jpg`, `FILE_PATH` is `another.jpg` and `FOLDER` can be `NULL` or empty string).
    *   (Note: A more advanced version of this application would have admin UI features for content uploading and metadata management.)

---
*This document provides the necessary steps to get the cinemaOcinema application running locally.*
