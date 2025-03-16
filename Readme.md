

### 1. **Controllers**

**Purpose**: Handle incoming HTTP requests, process any required input, and send responses back to the client. They act as intermediaries between the client and the services (business logic).

- **Responsibilities**:
  - Receive and interpret incoming HTTP requests (like `GET`, `POST`, `PUT`, and `DELETE`).
  - Validate request data and parameters.
  - Call the appropriate service functions to process data.
  - Format and send responses to the client.
  - Handle errors and ensure proper HTTP status codes are returned.

- **Example**: In `SpotifyController`, the controller method `login` redirects the user to Spotify's login URL, and `getUserPlaylists` fetches the user's playlists and returns them in the response.

### 2. **Services**

**Purpose**: Encapsulate the business logic of the application and handle data processing or interactions with external APIs/databases.

- **Responsibilities**:
  - Contain core business rules and data processing logic.
  - Act as a bridge between the controllers and external APIs/databases.
  - Ensure that the logic remains reusable, testable, and decoupled from the request/response cycle.
  - Manage API calls, database queries, and other logic-heavy tasks.

- **Example**: In `SpotifyService`, methods like `getAuthUrl` generate Spotify's authorization URL, and `getUserPlaylists` fetches playlists from the Spotify API. These methods perform tasks that the controller can then call without needing to know the implementation details.

### 3. **Routes**

**Purpose**: Define endpoints (URL paths) for the application and connect them to specific controller methods.

- **Responsibilities**:
  - Define and organize the routes in the application, like `/spotify/login` or `/spotify/playlists`.
  - Attach these routes to HTTP verbs (`GET`, `POST`, etc.) and point them to specific controller functions.
  - Help structure the application by grouping related endpoints (e.g., all Spotify-related routes in one file).

- **Example**: In `spotify.routes.ts`, routes like `router.get('/login', SpotifyController.login)` map incoming requests on `/login` to the `login` method in the `SpotifyController`.

### 4. **Interfaces**

**Purpose**: Define types or structures (especially in TypeScript) for data models, ensuring type safety and consistency throughout the codebase.

- **Responsibilities**:
  - Describe the shape of objects, like response data from external APIs or data processed by services.
  - Provide contracts that must be adhered to by any data structure implementing these interfaces.
  - Improve readability and maintainability by clearly defining expected data fields, which helps with validation and error-checking during development.

- **Example**: In `SpotifyTokens` interface, an object must have `access_token`, `refresh_token`, `expires_in`, and `token_type` properties.

---
