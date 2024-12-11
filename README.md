# Cloud Technology for DentAssist

## Overview

This project leverages Google Cloud Platform (GCP) for hosting, database management, and scalable backend services. It provides a cloud-based solution for DentAssist, focusing on efficient data management and seamless application deployment.

## Cloud Technology Used

### Google Cloud Platform (GCP)

GCP provides a comprehensive suite of services that support this project by enabling scalable infrastructure, data storage, and backend development.

### Services

- **App Engine**:
  - Service: `default`
  - Runtime: `nodejs18`
  - Environment: `standard`
  - Instance Class: `F2`
  - Location: `asia-southeast2`

- **Firestore**:
  - ID: (default)
  - Location: `asia-southeast2`

- **Cloud Storage**:
  - Location: `asia-southeast2`
  - Storage Class: `Standard`

## API Documentation

Access the API documentation for DentAssist at the following link:  
[API Documentation](https://dent-assist-bangkit.et.r.appspot.com/documentation)

## Google Cloud Architecture

Refer to the architecture diagram below to understand the cloud infrastructure used:  
![Google Cloud Architecture](https://github.com/user-attachments/assets/ec9b1352-a98c-496b-a4c8-5dbbe2b2e54b)


## Steps to Replicate

1. **Set Up Cloud Architecture**:
   - Configure Firestore with the following collections: `articles`, `clinics`, `histories`, `products`, and `users`.
   - Set up a Cloud Storage bucket to store your model and include a `predict-result` folder.

2. **Create a `.env` File**:
   - Add the following environment variables:
     ```
     MODEL_URL={path to your saved model}
     PROJECT_ID={your GCP project ID}
     FIRESTORE_ACCESS_KEY={key path to access Firestore with permission}
     CLOUD_BUCKET_ACCESS_KEY={key path to access Cloud Storage with permission}
     BUCKET_NAME={name of the bucket for model and prediction photo storage}
     ```

3. **Deploy the App**:
   - Deploy the application to App Engine following GCP's deployment guide.


## NoSQL Database Schema

Review the schema for the Firestore database below:  
![NoSQL Database Schema](https://github.com/user-attachments/assets/fb34df6c-d2f6-4bab-86e6-decf3feb4d54)

## API Workflow

![API Workflow](https://github.com/user-attachments/assets/a90fb985-1b16-4e76-8a05-00e317b2e7a6)

## API Endpoint Design

Explore the design of the API endpoints here:  
![API Endpoint Design](https://github.com/user-attachments/assets/939e9aaf-6f9b-4ba5-b1dd-68e10c4d4f46)

## Collaborators

| **Role**               | **ID**           | **Name**                                                                                 |
|------------------------|------------------|----------------------------------------------------------------------------------------- |
| **Cloud Computing**    | C312B4KY0809     | [Bani Rijal Barru Faza](https://www.linkedin.com/in/bani-rijal-81a430282/)               |
| **Cloud Computing**    | C312B4KX0862     | Bintang Immanuela Astrid Que                                                             |

