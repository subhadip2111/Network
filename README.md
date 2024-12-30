# Job Application Email Sender

This project automates the process of sending job application emails to HR departments. It uses a queue-based system to process and send emails with customized content based on the data uploaded via CSV files.

## Features

- **CSV Upload**: Upload a CSV file containing job application details like:
  - Company Name
  - HR Name
  - HR Email
  - Applicant Name
  - Applicant Email
  - Position Applied
  - Relevant Skills

- **Email Generation**: Automatically generates personalized email content based on the CSV data, including applicant details, position applied, and required skills.

- **Duplicate Checking**: Prevents multiple emails from being sent to the same HR contact by checking for duplicates.

- **Queue-based Email Processing**: Uses [BullMQ](https://github.com/Taskforces/BullMQ) for efficient background email processing.

- **Error Handling & Retry**: Includes automatic retries for failed email attempts with exponential backoff.

- **Kafka Integration**: Integrates with [Kafka](https://kafka.apache.org/) for real-time processing of job application topics.

## Project Structure

The project consists of the following components:

- **Frontend**: Allows users to upload a CSV file with job application details.
- **Backend Service**:
  - Reads and processes the CSV file.
  - Adds jobs to a BullMQ queue for email processing.
  - Sends personalized emails to HR contacts using [Nodemailer](https://nodemailer.com/).
  - Handles duplicate checks to ensure emails are not resent.
- **Kafka Consumer**: Listens for new job application data and processes it.
- **Email Worker**: A background worker that processes the email queue and sends emails.

## Setup & Installation

### Prerequisites
Before running the project, ensure the following are installed:

- [Node.js](https://nodejs.org/)
- [Redis](https://redis.io/) (for BullMQ queue processing)
- [Kafka](https://kafka.apache.org/) (for topic-based processing)
- A Gmail or other SMTP service for sending emails

### Steps to Run

1. **Clone the repository**:
   ```bash
     git clone <repo-url>
   Install dependencies:

Copy code
cd hrAutoEmail
npm install

Example CSV Format
The CSV file should be structured with the following columns:

Company Name	HR Name	HR Email	Applicant Name	Applicant Email	Position Applied	Skills
Company A	John Doe	john.doe@companyA.com	Jane Smith	jane.smith@example.com	Software Engineer	JavaScript, React, Node
Company B	Alice	alice@companyB.com	Bob Johnson	bob.johnson@example.com	Web Developer	HTML, CSS, JavaScript

![Screenshot from 2024-12-30 23-44-48](https://github.com/user-attachments/assets/6ff28b67-b25e-418f-b776-e528d0043a44)


![WhatsApp Image 2024-12-30 at 11 45 09 PM](https://github.com/user-attachments/assets/730a7a38-aafd-4c6f-a481-1e6d036f7ae1)
