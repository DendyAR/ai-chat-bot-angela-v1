import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Message = {
  role: "user" | "ai";
  content: string;
};

export type ChatSession = {
  id: string;
  title: string;
  messages: Message[];
};

type ChatState = {
  sessions: ChatSession[];
  activeSessionId: string | null;
  activeModel: string; // ✅ hanya gunakan ini
};

const loadFromLocalStorage = (): ChatState | undefined => {
  try {
    const raw = localStorage.getItem("chat-sessions");
    if (!raw) return undefined;
    return JSON.parse(raw) as ChatState;
  } catch {
    return undefined;
  }
};

const saveToLocalStorage = (state: ChatState) => {
  try {
    localStorage.setItem("chat-sessions", JSON.stringify(state));
  } catch {}
};

const initialState: ChatState = loadFromLocalStorage() || {
  sessions: [
    {
      id: crypto.randomUUID(),
      title: "New Chat",
      messages: [],
    },
  ],
  activeSessionId: null,
  activeModel: "mistralai/mistral-small-3.2-24b-instruct:free",
};

const chatSessionsSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addSession: (state) => {
      const newId = crypto.randomUUID();
      const newSession: ChatSession = {
        id: newId,
        title: "New Chat",
        messages: [],
      };
      state.sessions.unshift(newSession);
      state.activeSessionId = newId;
      saveToLocalStorage(state);
    },
    setActiveSession: (state, action: PayloadAction<string>) => {
      state.activeSessionId = action.payload;
      saveToLocalStorage(state);
    },
    addMessageToSession: (
      state,
      action: PayloadAction<{ sessionId: string; message: Message }>
    ) => {
      const session = state.sessions.find(
        (s) => s.id === action.payload.sessionId
      );
      if (session) {
        session.messages.push(action.payload.message);
        saveToLocalStorage(state);
      }
    },
    resetActiveSession: (state) => {
      const session = state.sessions.find(
        (s) => s.id === state.activeSessionId
      );
      if (session) {
        session.messages = [];
        saveToLocalStorage(state);
      }
    },
    clearAllSessions: (state) => {
      const newId = crypto.randomUUID();
      state.sessions = [
        {
          id: newId,
          title: "New Chat",
          messages: [],
        },
      ];
      state.activeSessionId = newId;
      saveToLocalStorage(state);
    },
    renameSession: (
      state,
      action: PayloadAction<{ sessionId: string; title: string }>
    ) => {
      const session = state.sessions.find(
        (s) => s.id === action.payload.sessionId
      );
      if (session) {
        session.title = action.payload.title;
        saveToLocalStorage(state);
      }
    },
    updateSessionMessage: (
      state,
      action: PayloadAction<{
        sessionId: string;
        messageIndex: number;
        newContent: string;
      }>
    ) => {
      const { sessionId, messageIndex, newContent } = action.payload;
      const session = state.sessions.find((s) => s.id === sessionId);
      if (session && session.messages[messageIndex]) {
        session.messages[messageIndex].content = newContent;
        saveToLocalStorage(state);
      }
    },
    setActiveModel: (state, action: PayloadAction<string>) => {
      state.activeModel = action.payload;
      saveToLocalStorage(state);
    },
    deleteSession: (state, action: PayloadAction<string>) => {
      state.sessions = state.sessions.filter((s) => s.id !== action.payload);
      if (state.activeSessionId === action.payload) {
        state.activeSessionId = state.sessions[0]?.id || null;
      }
      saveToLocalStorage(state);
    },
    resetChatState: () => {
      localStorage.removeItem("chat-sessions"); // Hapus penyimpanan lokal
      return {
        sessions: [],
        activeSessionId: null,
        activeModel: "mistralai/mistral-small-3.2-24b-instruct:free", // atau null jika kamu ingin kosong total
      };
    },
  },
});

export const {
  addSession,
  setActiveSession,
  addMessageToSession,
  resetActiveSession,
  clearAllSessions,
  renameSession,
  updateSessionMessage,
  setActiveModel, // ✅ hanya ini
  deleteSession,
} = chatSessionsSlice.actions;

export default chatSessionsSlice.reducer;
