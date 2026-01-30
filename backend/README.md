# Sudoku Backend API (Rails 8)

API-only Rails backend for a Sudoku game (puzzles, user-scoped game sessions, moves, and board state tracking).

## Stack
- Rails 8 (API-only)
- PostgreSQL
- Devise (API configured)
- JSON API
- Postman for manual testing

## Setup
```bash
bundle install
rails db:create db:migrate db:seed
rails s
## Authentication

This API uses Devise configured for JSON/API requests.

### Sign in
**POST** `/users/sign_in`

Headers:
- `Content-Type: application/json`
- `Accept: application/json`

Body:
```json
{
  "user": {
    "email": "test@test.com",
    "password": "password123"
  }
}

## Puzzles

Puzzles represent the base Sudoku boards used to initialize game sessions.

### List puzzles
**GET** `/puzzles`

Description:  
Returns all available puzzles that can be used to start a game session.

## Game Sessions

Game sessions represent an active Sudoku game for a specific user.
Each session is initialized from a puzzle and maintains the current board state.

### Create game session
**POST** `/game_sessions`

Description:  
Creates a new game session for the authenticated user using a puzzle.

Headers:
- `Content-Type: application/json`
- `Accept: application/json`

Body:
```json
{
  "puzzle_id": 1
}

## Moves

Moves represent player actions within a game session. Submitting a move updates the session `current_board`.

### Create move
**POST** `/game_sessions/:game_session_id/moves`

Description:  
Creates a move for the session (user-scoped) and updates `current_board`.

Headers:
- `Content-Type: application/json`
- `Accept: application/json`

Body:
```json
{
  "move": {
    "row": 0,
    "col": 2,
    "value": 4
  }
}
