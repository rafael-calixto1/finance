# Finance Simulator: Compound Interest Visualizer

Welcome to the Finance Simulator, a sophisticated yet user-friendly tool designed to demystify the power of compound interest. This application allows users to project their investment growth over time, providing clear, visual, and detailed insights into how consistent investments can build significant wealth.

This project stands out not just for its functionality but for its meticulous construction, emphasizing a clean, scalable architecture, code quality, and a seamless user experience.

## ✨ Key Features

- **Dynamic Investment Simulation:** Project future wealth by providing an initial amount, regular monthly contributions, interest rate, and investment timeline.
- **Interactive Growth Chart:** A responsive line chart visualizes the core components of your investment journey: total principal invested, cumulative interest earned, and the total accumulated value.
- **Granular Monthly Data:** Dive deep into a detailed, month-by-month table that breaks down interest accrual and growth.
- **Flexible Interest Rate Handling:** Accurately calculates growth based on either monthly or annual interest rates, correctly converting annual rates to their monthly equivalent for precise projections.
- **Modern & Responsive UI:** A clean, intuitive interface built with Bootstrap ensures a seamless experience on any device, from desktops to smartphones.

## 🚀 Technologies & Architecture

This full-stack application is built using a modern, robust technology stack, with a strong emphasis on best practices and maintainability.

### Backend

- **Java 24 & Spring Boot 3.5.3:** The server-side is built on a solid foundation of Java and the Spring Boot framework, enabling rapid development of a secure and scalable REST API.
- **Clean Architecture:** The backend code is thoughtfully organized following clean architecture principles. Logic is distinctly separated into controllers (API layer), services (business logic), and utilities. This separation of concerns makes the codebase highly maintainable, testable, and easy to extend.
- **Financial Precision:** Utilizes `BigDecimal` for all monetary calculations, a critical best practice that avoids common floating-point inaccuracies and ensures the financial projections are precise and reliable.
- **Validation:** Implements server-side validation (`@Valid`) to ensure data integrity and provide clear, immediate feedback on API requests.

### Frontend

- **React:** The dynamic and interactive user interface is built with React, using modern features like functional components and hooks (`useState`, `useEffect`, `useRef`) for efficient state management and lifecycle handling.
- **Chart.js:** Employs Chart.js to render beautiful and interactive data visualizations, enhancing the user's ability to understand the simulation results.
- **User-Centric Design:** The interface is designed for clarity and ease of use. Features like dynamic chart tooltips that provide rich, contextual data for each month demonstrate a thoughtful approach to user experience.

## 💻 Getting Started

To run the Finance Simulator on your local machine, please follow the steps below.

### Prerequisites

- Java 17 or higher
- Node.js and npm

### Backend Setup

1.  Navigate to the `backend` project directory:
    ```bash
    cd backend
    ```
2.  Run the application using the Maven wrapper:
    ```bash
    ./mvnw spring-boot:run
    ```
    The backend API will now be running on `http://localhost:8080`.

### Frontend Setup

1.  In a separate terminal, navigate to the `frontend` project directory:
    ```bash
    cd frontend
    ```
2.  Install the necessary dependencies:
    ```bash
    npm install
    ```
3.  Start the React development server:
    ```bash
    npm start
    ```
    The application will automatically open in your default web browser at `http://localhost:3000`.

## 💡 Potential Use Cases

- **Personal Financial Planning:** An essential tool for individuals planning for retirement, savings goals, or understanding the long-term impact of their investment choices.
- **Educational Tool:** An excellent resource for students and educators to visually demonstrate the powerful concept of compound interest.
- **Financial Advisors:** A practical aid for advisors to illustrate potential investment growth scenarios for their clients.