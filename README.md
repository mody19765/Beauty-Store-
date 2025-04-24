# Beauty Store Management System

This web-based application is designed to manage beauty store operations efficiently, focusing on customer bookings, services, employee scheduling, and branch management. The app helps streamline day-to-day activities, improve service delivery, and ensure smooth business operations.

## Key Features:
- **Customer Booking System**: Enables customers to easily book services, view available time slots, and receive confirmations.
- **Service and Staff Management**: Provides a backend interface for managing services, scheduling, and assigning tasks to employees.
- **Branch Operations**: Allows administrators to manage different branches, including staff allocation, service offerings, and scheduling.
- **Search and Filter**: Integrated advanced search functionality to quickly find customer records, service details, and appointments.
- **Authentication**: Secure user authentication for both customers and staff to ensure privacy and data security.

## Technologies Used:
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose for schema management and data validation
- **Email**: Nodemailer for sending emails
- **Authentication**: JWT for secure user access and token-based authentication
- **Other**: RESTful API architecture, advanced search and filtering logic

## Installation:
1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/Beauty-Store-Management-System.git
    ```
2. Install dependencies:
    ```bash
    cd Beauty-Store-Management-System
    npm install
    ```
3. Set up environment variables (e.g., database connection, email settings) in a `.env` file.

4. Run the app:
    ```bash
    npm start
    ```

## Usage:
- Customers can book services, view available slots, and receive booking confirmations.
- Admins can manage services, employees, and branches.
- JWT authentication ensures secure user access to the system.

## License:
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
