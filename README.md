# 🅰️ Angular Document Dashboard

A reactive Single Page Application (SPA) designed to visualize incoming invoice streams in real-time. It features a modern UI, client-side filtering, and live updates using RxJS.

## 🏗 Architecture
* **Reactive Services:** Uses `BehaviorSubject` to manage state and `EventSource` to listen for backend push notifications.
* **Smart Components:** Implements `OnDestroy` to prevent memory leaks by cleaning up subscriptions.
* **Strict Typing:** Full TypeScript interfaces mirroring the backend DTOs.

## 🚀 Features
* **Live Updates:** New rows "fade in" at the top of the table automatically when processed by the backend.
* **Pagination:** Fully integrated with Spring Boot's `Pageable` API.
* **Dynamic Filtering:** Filter by RUC or Date instantly.
* **Security:** Sanitizes Base64 images to prevent XSS attacks.

## 🛠 Prerequisites
* **Node.js (LTS Version)**
* **Angular CLI:** `npm install -g @angular/cli`

## ⚙️ Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/document-ui.git](https://github.com/your-username/document-ui.git)
    cd document-ui
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Setup Assets:**
    * Ensure your logo image is placed in `src/assets/images/logo-aquarius.png`.

## 🏃‍♂️ Execution

1.  **Start Development Server:**
    ```bash
    ng serve
    ```

2.  **Access Dashboard:**
    * Open your browser to `http://localhost:4200`.

## 📂 Project Structure
```text
src/app
  ├── /components   # UI Components (List, Modal)
  ├── /models       # TypeScript Interfaces
  ├── /services     # HTTP & SSE Logic
  └── /environments # API URL Configuration
