const STORAGE_KEY = "kago-shopping-state-v1";

const defaultState = {
  items: [
    { id: "sample-1", name: "オーツミルク", category: "food", completed: false, createdAt: Date.now() },
    { id: "sample-2", name: "食器用スポンジ", category: "daily", completed: false, createdAt: Date.now() - 1 },
    { id: "sample-3", name: "コーヒー豆", category: "food", completed: true, createdAt: Date.now() - 2 },
  ],
  history: [],
};

export function loadState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? defaultState;
  } catch {
    return defaultState;
  }
}

export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function createItem(name, category) {
  return { id: crypto.randomUUID(), name: name.trim(), category, completed: false, createdAt: Date.now() };
}
