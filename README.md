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

## Data Models

### **Parent Model**
### Fields:
- **`username`**: Parent's username.  
- **`profilePic`**: Optional profile picture.  
- **`email`**: Unique email for authentication.  
- **`password`**: Hashed password for security.  
- **`confirmEmail`**: Email verification status.  
- **`sendCode`**: Temporary code for email confirmation or password recovery.  
- **`changePasswordTime`**: Timestamp of the last password change.  
- **`address`**: Parent's address.

### Virtual Fields:
- **`children`**: Links to the `Child` model (1-to-many relationship).

### **Child Model**

### Fields:
- **`name`**: Child's name.  
- **`dateOfBirth`**: Child's date of birth.  
- **`gender`**: Child's gender (`Male`/`Female`).  
- **`profilePic`**: Optional profile picture.  
- **`parentId`**: Links to the `Parent` model.

### Virtual Fields:
- **`drawings`**: Links to the `Drawing` model (1-to-many relationship).

### **Drawing Model**

### Fields:
- **`imageUrl`**: Drawing's Cloudinary URL and public ID.  
- **`prediction`**: Psychological analysis result.  
- **`childId`**: Links to the `Child` model.  
- **`parentId`**: Links to the `Parent` model.

## **Relationships**

1. **Parent → Children**:  
   One parent can have multiple children.  
   - Defined via the virtual field `children` in the `Parent` model.

2. **Child → Drawings**:  
   One child can have multiple drawings.  
   - Defined via the virtual field `drawings` in the `Child` model.

3. **Parent → Drawings**:  
   Drawings are indirectly linked to parents using `parentId` in the `Drawing` model.

## Technology Stack

- **Backend**: Node.js, Express.js
- **Authentication**: JWT, `bcryptjs`
- **Validation**: `Joi`
- **File Upload**: `multer`, Cloudinary
- **Environment Management**: `dotenv`
- **Email Service**: `nodemailer`
- **Cross-Origin Resource Sharing**: `cors`

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/HebaHamdan2/ChildDrawingsSpeak.git
cd ChildDrawingsSpeak
```
### 2. Install Dependencies
```bash
npm install
```
### 3. Environment Variables
 - Create a .env file in the root directory and set the following variables:
```bash
DB=<your-mongodb-connection-string>
PASSWORDSENDER=<your-password>
EMAILSENDER=<your-email-address>
SALT_ROUND=<number-of-hashing>
CONFIRMEMAILSECRET=<your-confirm-email-secret>
APP_NAME=<your-app-name>
LOGINSECRET=<your-login-secret>
BEARERKEY=<your-bearerkey>
cloud_name=<youe-cloudinary-name>
api_key=<your-api-key-cloudinary>
api_secret=<your-api-secret-cloudinary>
```
### 4. Run the Server
 - Start the server in development mode:
```bash
npm run dev
```
## Contributing

Contributions are welcome! Please feel free to create an issue or submit a pull request for enhancements or bug fixes.
