import { useState, useEffect, useCallback } from "react";

function App() {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState("notes");
  const [currentQuote, setCurrentQuote] = useState(null);
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);
  const [newQuoteText, setNewQuoteText] = useState("");
  const [newQuoteAuthor, setNewQuoteAuthor] = useState("");
  const [editingQuoteId, setEditingQuoteId] = useState(null);

  // Default quotes with IDs and isDefault flag
  const defaultQuotes = [
    {
      id: "default-1",
      text: "The future belongs to those who believe in the beauty of their dreams.",
      author: "Eleanor Roosevelt",
      isDefault: true,
      date: new Date().toLocaleString(),
    },
    {
      id: "default-2",
      text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
      author: "Winston Churchill",
      isDefault: true,
      date: new Date().toLocaleString(),
    },
    {
      id: "default-3",
      text: "The only way to do great work is to love what you do.",
      author: "Steve Jobs",
      isDefault: true,
      date: new Date().toLocaleString(),
    },
    {
      id: "default-4",
      text: "Believe you can and you're halfway there.",
      author: "Theodore Roosevelt",
      isDefault: true,
      date: new Date().toLocaleString(),
    },
    {
      id: "default-5",
      text: "Everything you've ever wanted is on the other side of fear.",
      author: "George Addair",
      isDefault: true,
      date: new Date().toLocaleString(),
    },
    {
      id: "default-6",
      text: "The best way to predict the future is to create it.",
      author: "Peter Drucker",
      isDefault: true,
      date: new Date().toLocaleString(),
    },
    {
      id: "default-7",
      text: "Don't watch the clock; do what it does. Keep going.",
      author: "Sam Levenson",
      isDefault: true,
      date: new Date().toLocaleString(),
    },
    {
      id: "default-8",
      text: "The only limit to our realization of tomorrow will be our doubts of today.",
      author: "Franklin D. Roosevelt",
      isDefault: true,
      date: new Date().toLocaleString(),
    },
  ];

  // Combined quotes state (default + user quotes)
  const [allQuotes, setAllQuotes] = useState(() => {
    const savedQuotes = localStorage.getItem("userQuotes");
    const userQuotes = savedQuotes ? JSON.parse(savedQuotes) : [];
    return [...defaultQuotes, ...userQuotes];
  });

  // Load notes from localStorage when the app starts
  useEffect(() => {
    const savedNotes = localStorage.getItem("notes");
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  // Save user quotes to localStorage whenever they change
  useEffect(() => {
    const userQuotes = allQuotes.filter((quote) => !quote.isDefault);
    localStorage.setItem("userQuotes", JSON.stringify(userQuotes));
  }, [allQuotes]);

  // Get a new quote every 30 seconds on the quotes page
  useEffect(() => {
    if (currentPage === "quotes") {
      getRandomQuote();
      const interval = setInterval(getRandomQuote, 30000);
      return () => clearInterval(interval);
    }
  }, [currentPage]);

  const getRandomQuote = () => {
    setIsLoadingQuote(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * allQuotes.length);
      setCurrentQuote(allQuotes[randomIndex]);
      setIsLoadingQuote(false);
    }, 300);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!note.trim()) return;

    if (editingId) {
      // Update existing note
      setNotes(
        notes.map((n) =>
          n.id === editingId
            ? { ...n, text: note, lastEdited: new Date().toLocaleString() }
            : n
        )
      );
      setEditingId(null);
    } else {
      // Create new note
      const newNote = {
        id: Date.now(),
        text: note,
        date: new Date().toLocaleString(),
      };
      setNotes([newNote, ...notes]);
    }
    setNote("");
  };

  const deleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const editNote = (note) => {
    setNote(note.text);
    setEditingId(note.id);
  };

  const handleAddQuote = (e) => {
    e.preventDefault();
    if (!newQuoteText.trim() || !newQuoteAuthor.trim()) return;

    const newQuote = {
      id: Date.now().toString(),
      text: newQuoteText.trim(),
      author: newQuoteAuthor.trim(),
      date: new Date().toLocaleString(),
      isDefault: false,
    };

    setAllQuotes((prevQuotes) => [newQuote, ...prevQuotes]);
    setNewQuoteText("");
    setNewQuoteAuthor("");
    setEditingQuoteId(null);
  };

  // Simplified input handlers without preventDefault
  const handleQuoteTextChange = useCallback((e) => {
    setNewQuoteText(e.target.value);
  }, []);

  const handleAuthorChange = useCallback((e) => {
    setNewQuoteAuthor(e.target.value);
  }, []);

  const editQuote = (quote) => {
    setNewQuoteText(quote.text);
    setNewQuoteAuthor(quote.author);
    setEditingQuoteId(quote.id);
    document
      .querySelector(".add-quote-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const deleteQuote = (id) => {
    setAllQuotes((prevQuotes) => prevQuotes.filter((quote) => quote.id !== id));
  };

  const handleUpdateQuote = (e) => {
    e.preventDefault();
    if (!newQuoteText.trim() || !newQuoteAuthor.trim()) return;

    setAllQuotes((prevQuotes) =>
      prevQuotes.map((quote) =>
        quote.id === editingQuoteId
          ? {
              ...quote,
              text: newQuoteText.trim(),
              author: newQuoteAuthor.trim(),
              lastEdited: new Date().toLocaleString(),
            }
          : quote
      )
    );

    setNewQuoteText("");
    setNewQuoteAuthor("");
    setEditingQuoteId(null);
  };

  // About page component
  const AboutPage = () => (
    <div className="about-page">
      <h2>About PsycheBloom</h2>
      <h3>"Repeat it until you hear what you're saying."</h3>
      <p>
      Life moves fast, and our thoughts, ideas, and reflections can often get lost in the rush. "Leave a Note for Yourself" is designed to help you capture and revisit those important moments—whether it's an inspiring thought, a personal reminder, or a meaningful quote. In the rush of life, we sometimes forget ourselves, letting our thoughts and emotions pass by unnoticed. "Leave a Note for Yourself" steps in precisely at this moment, aiming to enhance your self-awareness.
This platform is not just for taking notes; it exists to help you hear your inner voice, understand your emotions, and discover your true thoughts. Every note you write to yourself is a step toward greater mindfulness.


      </p>
      <ul>
        <li>Create and store notes</li>
        <li>Delete unwanted notes</li>
        <li>Edit existing notes</li>
        <li>Automatic saving to local storage</li>
        <li>Timestamps for creation and edits</li>
        <li>Real-time inspirational quotes</li>
      </ul>
      <p>
        Built with React and modern web technologies, PsycheBloom provides a
        clean and intuitive interface for all your note-taking needs.
      </p>
    </div>
  );

  // Quotes page component - for displaying random quotes
  const QuotesPage = () => (
    <div className="quotes-page">
      <div className="quote-container">
        {isLoadingQuote ? (
          <div className="loading-spinner">Loading...</div>
        ) : currentQuote ? (
          <>
            <p className="quote-text">"{currentQuote.text}"</p>
            <p className="quote-author">- {currentQuote.author}</p>
            <button onClick={getRandomQuote} className="new-quote-button">
              New Quote
            </button>
          </>
        ) : null}
      </div>
    </div>
  );

  // My Quotes page component - for managing user's quotes
  const MyQuotesPage = () => {
    const userQuotes = allQuotes.filter((quote) => !quote.isDefault);

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!newQuoteText.trim() || !newQuoteAuthor.trim()) return;

      if (editingQuoteId) {
        setAllQuotes((prevQuotes) =>
          prevQuotes.map((quote) =>
            quote.id === editingQuoteId
              ? {
                  ...quote,
                  text: newQuoteText.trim(),
                  author: newQuoteAuthor.trim(),
                  lastEdited: new Date().toLocaleString(),
                }
              : quote
          )
        );
        setEditingQuoteId(null);
      } else {
        const newQuote = {
          id: Date.now().toString(),
          text: newQuoteText.trim(),
          author: newQuoteAuthor.trim(),
          date: new Date().toLocaleString(),
          isDefault: false,
        };
        setAllQuotes((prevQuotes) => [newQuote, ...prevQuotes]);
      }
      setNewQuoteText("");
      setNewQuoteAuthor("");
    };

    const startEdit = (quote) => {
      setEditingQuoteId(quote.id);
      setNewQuoteText(quote.text);
      setNewQuoteAuthor(quote.author);
    };

    const cancelEdit = () => {
      setEditingQuoteId(null);
      setNewQuoteText("");
      setNewQuoteAuthor("");
    };

    return (
      <div className="quotes-page">
        <div className="add-quote-section">
          <h3>{editingQuoteId ? "Edit Quote" : "Add Your Own Quote"}</h3>
          <form onSubmit={handleSubmit} className="add-quote-form">
            <div className="input-group">
              <label htmlFor="quoteText">Quote Text:</label>
              <textarea
                id="quoteText"
                value={newQuoteText}
                onChange={(e) => setNewQuoteText(e.target.value)}
                onFocus={() => console.log("Quote text focused")}
                onBlur={() => console.log("Quote text blurred")}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    const authorInput = document.getElementById("quoteAuthor");
                    if (authorInput) {
                      authorInput.focus();
                    }
                  }
                }}
                placeholder="Enter your motivational quote..."
                className="note-input"
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  minHeight: "100px",
                  marginBottom: "10px",
                  fontFamily: "inherit",
                  outline: "none",
                  transition: "border-color 0.2s ease",
                }}
              />
            </div>
            <div className="input-group">
              <label htmlFor="quoteAuthor">Author:</label>
              <input
                id="quoteAuthor"
                type="text"
                value={newQuoteAuthor}
                onChange={(e) => setNewQuoteAuthor(e.target.value)}
                onFocus={() => console.log("Author input focused")}
                onBlur={() => console.log("Author input blurred")}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder="Enter the author's name..."
                className="note-input"
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  marginBottom: "10px",
                  fontFamily: "inherit",
                  outline: "none",
                  transition: "border-color 0.2s ease",
                }}
              />
            </div>
            <div className="form-buttons">
              <button type="submit" className="submit-button">
                {editingQuoteId ? "Update Quote" : "Add Quote"}
              </button>
              {editingQuoteId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="cancel-button"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="quotes-list">
          <h3>Your Quotes</h3>
          {userQuotes.length === 0 ? (
            <p className="no-quotes">
              No quotes added yet. Add your first quote above!
            </p>
          ) : (
            userQuotes.map((quote) => (
              <div key={quote.id} className="quote-item">
                <p className="quote-text">"{quote.text}"</p>
                <p className="quote-author">- {quote.author}</p>
                <div className="quote-footer">
                  <div className="quote-meta">
                    <span className="quote-date">Added: {quote.date}</span>
                    {quote.lastEdited && (
                      <span className="quote-edited">
                        Edited: {quote.lastEdited}
                      </span>
                    )}
                  </div>
                  <div className="quote-actions">
                    <button
                      onClick={() => startEdit(quote)}
                      className="edit-button"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteQuote(quote.id)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="app">
      <nav className="navbar">
        <h1>PsycheBloom</h1>
        <div className="nav-links">
          <button
            className={`nav-button ${currentPage === "notes" ? "active" : ""}`}
            onClick={() => setCurrentPage("notes")}
          >
            Notes
          </button>
          <button
            className={`nav-button ${currentPage === "quotes" ? "active" : ""}`}
            onClick={() => setCurrentPage("quotes")}
          >
            Quotes
          </button>
          <button
            className={`nav-button ${
              currentPage === "myquotes" ? "active" : ""
            }`}
            onClick={() => setCurrentPage("myquotes")}
          >
            My Quotes
          </button>
          <button
            className={`nav-button ${currentPage === "about" ? "active" : ""}`}
            onClick={() => setCurrentPage("about")}
          >
            About
          </button>
        </div>
      </nav>

      {currentPage === "notes" ? (
        <>
          <form onSubmit={handleSubmit} className="note-form">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Write a note to yourself..."
              rows="4"
              className="note-input"
            />
            <button type="submit" className="submit-button">
              {editingId ? "Update Note" : "Save Note"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setNote("");
                }}
                className="cancel-button"
              >
                Cancel Edit
              </button>
            )}
          </form>

          <div className="notes-list">
            {notes.map((note) => (
              <div key={note.id} className="note-item">
                <p className="note-text">{note.text}</p>
                <div className="note-footer">
                  <div className="note-meta">
                    <span className="note-date">Created: {note.date}</span>
                    {note.lastEdited && (
                      <span className="note-edited">
                        Edited: {note.lastEdited}
                      </span>
                    )}
                  </div>
                  <div className="note-actions">
                    <button
                      onClick={() => editNote(note)}
                      className="edit-button"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : currentPage === "quotes" ? (
        <QuotesPage />
      ) : currentPage === "myquotes" ? (
        <MyQuotesPage />
      ) : (
        <AboutPage />
      )}
    </div>
  );
}

export default App;
