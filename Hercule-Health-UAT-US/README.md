# Hercule-Health UAT Setup Instructions

This README provides instructions for setting up configuration files and environment variables for the Hercule-Health UAT environment.

## 1. Add the `config` Folder

You need to copy the `config` folder to the following locations in your project:

- `HerculeHealthBackend/src/config`
- `HerculeHealthFrontend/src/config`

Make sure the `config` folder contains all necessary configuration files required for your application.

## 2. Add the `.env` File

Place your `.env` file at the following path:

- `HerculeHealthBackend/.env`

The `.env` file should contain all required environment variables for the backend application.

---

**Note:**
- Ensure that sensitive information in the `.env` file is not committed to version control.
- If you do not have the `config` folder or `.env` file, please contact your project administrator.
