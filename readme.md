# Voting App Backend

This is the backend for a voting application where users can vote for candidates, view live vote counts, and manage their profiles. The application also includes an admin role for managing candidates.

## Features

1. **User Authentication**:
   - Sign up and log in using Aadhaar card number and password.
   - Change password.

2. **Voting**:
   - View the list of candidates.
   - Vote for a candidate (users can vote only once).

3. **Vote Counts**:
   - View live vote counts for all candidates, sorted by vote count.

4. **Admin Management**:
   - Admin can add, update, and delete candidates.
   - Admin cannot vote.

## Project Structure

### Key Files

- **`server.js`**: Entry point of the application.
- **`Database/dbConnection.js`**: Handles database connection.
- **`models/`**: Contains Mongoose models for `User` and `Candidate`.
- **`routes/`**: Contains routes for user and candidate functionalities.
- **`jwt.js`**: Handles JWT authentication.

## API Endpoints

### User Authentication
- **POST** `/user/signup`: Create a new user account.
- **POST** `/user/login`: Log in to an existing account.
- **GET** `/user/profile`: Get the user's profile information.
- **PUT** `/user/profile/password`: Change the user's password.

### Voting
- **GET** `/candidate/candidate`: Get the list of candidates.
- **POST** `/candidate/vote/:candidateId`: Vote for a specific candidate.

### Vote Counts
- **GET** `/candidate/vote/count`: Get the list of candidates sorted by their vote counts.

### Admin Candidate Management
- **POST** `/candidate/`: Create a new candidate.
- **PUT** `/candidate/:candidateId`: Update an existing candidate.
- **DELETE** `/candidate/:candidateId`: Delete a candidate.


