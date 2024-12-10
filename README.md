# Cloud Technology for DentAssist

## Overview

This project utilizes Google Cloud Platform (GCP) for hosting, database management, and application development. It is designed to provide a cloud-based solution for DentAssist, focusing on efficient data management and scalable backend services.

## Cloud Technology Used

### Google Cloud Platform (GCP)
GCP offers a suite of cloud computing services that power this project, providing infrastructure for running applications, storing and managing data, and developing software solutions.

### Services

- **App Engine**:
  - **Service**: `default`
  - **Runtime**: `nodejs18`
  - **Environment**: `standard`
  - **Instance Class**: `F2`
  - **Location**: `asia-southeast2`

- **Firestore**:
  - **ID**: (default)
  - **Location**: `asia-southeast2`

- **Cloud Storage**:
  - **Location**: `asia-southeast2`
  - **Storage Class**: `Standard`

## API Documentation

The API documentation for the DentAssist application is available at:
[API Documentation]()

## NoSQL Database Schema
![NoSQL Database Schema](https://github.com/user-attachments/assets/fb34df6c-d2f6-4bab-86e6-decf3feb4d54)

## API Endpoint Design
![API Endpoint Design](https://github.com/user-attachments/assets/939e9aaf-6f9b-4ba5-b1dd-68e10c4d4f46)

## Google Cloud Architecture
![Google Cloud Architecture](https://github.com/user-attachments/assets/7708524c-6662-424c-b820-7201bfe5fe83)

### Design Considerations

1. **NoSQL Database**: Firestore is used as the primary database for managing structured data due to its scalability, low latency, and easy integration with GCP services.
2. **API Endpoint Design**: The endpoints are designed to handle RESTful requests efficiently, leveraging Hapi.js for backend operations and TensorFlow/tfjs-node for machine learning model integrations.
3. **Google Cloud Architecture**: The architecture includes Firestore for persistent data storage, Cloud Storage for model storage, and App Engine for deploying the backend application.

---

Feel free to customize and expand the content based on additional details or specific requirements of your project.
