package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"sync"
)


var (
    store = NewStore()
)

func main() {
    http.HandleFunc("/login", loginHandler)
    http.HandleFunc("/logout", authMiddleware(logoutHandler))
    http.HandleFunc("/userinfo", authMiddleware(userInfoHandler))

    http.ListenAndServe(":8080", nil)
}

type User struct {
    Name     string `json:"name"`
    Email    string `json:"email"`
    Password string `json:"password"`
}

type Store struct {
    users   map[string]User
    sessions map[string]string
    mu      sync.Mutex
}

func NewStore() *Store {
    return &Store{
        users:   make(map[string]User),
        sessions: make(map[string]string),
    }
}

func (s *Store) AddUser(user User) {
    s.mu.Lock()
    defer s.mu.Unlock()
    s.users[user.Email] = user
}

func (s *Store) GetUser(email string) (User, bool) {
    s.mu.Lock()
    defer s.mu.Unlock()
    user, exists := s.users[email]
    return user, exists
}

func (s *Store) AddSession(token, email string) {
    s.mu.Lock()
    defer s.mu.Unlock()
    s.sessions[token] = email
}

func (s *Store) GetSession(token string) (string, bool) {
    s.mu.Lock()
    defer s.mu.Unlock()
    email, exists := s.sessions[token]
    return email, exists
}

func (s *Store) DeleteSession(token string) {
    s.mu.Lock()
    defer s.mu.Unlock()
    delete(s.sessions, token)
	
}

func enableCors(w *http.ResponseWriter) {
    (*w).Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
    (*w).Header().Set("Access-Control-Allow-Credentials", "true")
    (*w).Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
    (*w).Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
}

func init() {
    // Test-Benutzer hinzufügen
    store.AddUser(User{
        Name:     "Max Mustermann",
        Email:    "test@example.com",
        Password: "dummy",
    })
}


// loginHandler mit Debug-Logging erweitern
func loginHandler(w http.ResponseWriter, r *http.Request) {
    enableCors(&w)
    if r.Method == "OPTIONS" {
        w.WriteHeader(http.StatusOK)
        return
    }

    var credentials struct {
        Email    string `json:"email"`
        Password string `json:"password"`
    }

    // Request-Body Debug-Logging
    body, _ := io.ReadAll(r.Body)
    fmt.Printf("Received request body: %s\n", string(body))
    r.Body = io.NopCloser(bytes.NewBuffer(body))

    if err := json.NewDecoder(r.Body).Decode(&credentials); err != nil {
        fmt.Printf("Error decoding credentials: %v\n", err)
        http.Error(w, "Invalid request payload", http.StatusBadRequest)
        return
    }

    fmt.Printf("Login attempt for email: %s\n", credentials.Email)

    storedUser, exists := store.GetUser(credentials.Email)
    if !exists {
        fmt.Printf("User not found: %s\n", credentials.Email)
        http.Error(w, "Invalid email or password", http.StatusUnauthorized)
        return
    }

    if storedUser.Password != credentials.Password {
        fmt.Printf("Invalid password for user: %s\n", credentials.Email)
        http.Error(w, "Invalid email or password", http.StatusUnauthorized)
        return
    }

    token := "some-random-token"
    store.AddSession(token, credentials.Email)

    http.SetCookie(w, &http.Cookie{
        Name:  "session_token",
        Value: token,
        Path:  "/",
    })

    json.NewEncoder(w).Encode(map[string]string{
        "name":  storedUser.Name,
        "email": storedUser.Email,
    })
}

func logoutHandler(w http.ResponseWriter, r *http.Request) {
    cookie, err := r.Cookie("session_token")
    if err != nil {
        http.Error(w, "Unauthorized", http.StatusUnauthorized)
        return
    }

    store.DeleteSession(cookie.Value)
    http.SetCookie(w, &http.Cookie{
        Name:   "session_token",
        Value:  "",
        Path:   "/",
        MaxAge: -1,
    })

    w.WriteHeader(http.StatusOK)
}

func userInfoHandler(w http.ResponseWriter, r *http.Request) {
    email := r.Context().Value("email").(string)
    user, exists := store.GetUser(email)
    if !exists {
        http.Error(w, "User not found", http.StatusNotFound)
        return
    }

    json.NewEncoder(w).Encode(user)
}

func authMiddleware(next http.HandlerFunc) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        cookie, err := r.Cookie("session_token")
        if (err != nil) {
            http.Error(w, "Unauthorized", http.StatusUnauthorized)
            return
        }

        email, exists := store.GetSession(cookie.Value)
        if !exists {
            http.Error(w, "Unauthorized", http.StatusUnauthorized)
            return
        }

        ctx := r.Context()
        ctx = context.WithValue(ctx, "email", email)
        next.ServeHTTP(w, r.WithContext(ctx))
    }
}