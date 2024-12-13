# ChildDrawingsSpeak - Backend
## Overview
This repository provides a backend application built with Node.js and Express.js to support an app for analyzing and recording children's psychological health based on their drawings. This backend provides secure APIs for managing parents, children, and their drawings, while integrating services for authentication, validation, email notifications, and cloud-based file storage.

## Features

- **Parent Management**:
  - Parents can sign up, verify their email, and sign in.
  - Passwords are securely hashed using `bcryptjs`.
  - JSON Web Tokens (JWT) are used for authentication.

- **Child Profiles**:
  - Each parent can create and manage multiple child profiles.
  - Each child profile is associated with psychological health records stored via their drawings.

- **Drawing Records**:
  - Drawings can be uploaded for each child profile.
  - The uploaded drawing is analyzed by a trained deep learning model from the previous repository can be found [here](https://github.com/HebaHamdan2/ChildDrawingClassifier-api) , and the result is recorded.

- **Cloudinary Integration**:
  - Profile images and drawing images are securely stored in Cloudinary.

- **Validation and Middleware**:
  - Input validation is implemented using `Joi`.
  - Authentication and authorization are handled via custom middleware.

- **Email Notifications**:
  - Email confirmation and notifications are sent using `nodemailer`.

---

## Data Models

### 1. **Parent**
- **Fields**:
  - `email`: Parent's email (unique).
  - `password`: Hashed password.
  - `verified`: Email verification status.
- **Relationships**:
  - One-to-many relationship with `Child`.

### 2. **Child**
- **Fields**:
  - `name`: Child's name.
  - `age`: Child's age.
  - `profileImage`: Child's profile image (stored in Cloudinary).
- **Relationships**:
  - One-to-many relationship with `Drawing`.
  - Belongs to `Parent`.

### 3. **Drawing**
- **Fields**:
  - `imageUrl`: URL and public ID of the uploaded drawing (stored in Cloudinary).
  - `prediction`: Psychological health classification from the trained model.
- **Relationships**:
  - Belongs to a `Child`.

---

## Technology Stack

- **Backend**: Node.js, Express.js
- **Authentication**: JWT, `bcryptjs`
- **Validation**: `Joi`
- **File Upload**: `multer`, Cloudinary
- **Environment Management**: `dotenv`
- **Email Service**: `nodemailer`
- **Cross-Origin Resource Sharing**: `cors`

---

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/HebaHamdan2/ChildDrawingsSpeak.git
cd ChildDrawingsSpeak
```

