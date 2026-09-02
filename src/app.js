import { createItem, loadState, saveState } from "./store.js";

const labels = { food: "食料品", daily: "日用品", other: "その他" };
let state = loadState();
const $ = (selector) => document.querySelector(selector);
const elements = { form: $("#itemForm"), input: $("#itemInput"), category: $("#categoryInput"), list: $("#shoppingList"), empty: $("#emptyState"), history: $("#historyList") };

function escapeHtml(value) {
  const node = document.createElement("span"); node.textContent = value; return node.innerHTML;
}

function render() {
  const sorted = [...state.items].sort((a, b) => Number(a.completed) - Number(b.completed) || b.createdAt - a.createdAt);
  elements.list.innerHTML = sorted.map((item) => `<article class="item ${item.completed ? "completed" : ""}" data-id="${item.id}">
    <input class="check" type="checkbox" ${item.completed ? "checked" : ""} aria-label="${escapeHtml(item.name)}を購入済みにする" />
    <div><div class="item-name">${escapeHtml(item.name)}</div><div class="item-meta"><span class="category-dot ${item.category}"></span>${labels[item.category] ?? labels.other}</div></div>
    <button class="delete-button" type="button" aria-label="${escapeHtml(item.name)}を削除">×</button>
  </article>`).join("");
  elements.empty.hidden = state.items.length > 0;
  const done = state.items.filter((item) => item.completed).length;
  const total = state.items.length;
  const percent = total ? Math.round((done / total) * 100) : 0;
  $("#remainingCount").textContent = `${total - done} items`;
  $("#progressNumber").textContent = percent;
  $("#progressRing").style.setProperty("--progress", `${percent * 3.6}deg`);
  $("#progressLabel").textContent = percent === 100 && total ? "買い物完了！" : done ? "いい調子です" : "準備をはじめよう";
  $("#progressDetail").textContent = total ? `${done} / ${total} アイテム購入済み` : "アイテムを追加してください";
  elements.history.innerHTML = state.history.length ? state.history.slice(0, 6).map((record) => `<article class="history-card"><strong>${escapeHtml(record.name)}</strong><p>${labels[record.category] ?? labels.other} ・ ${formatDate(record.boughtAt)}</p></article>`).join("") : `<p class="hero-copy">購入済みにすると、ここに記録が残ります。</p>`;
  saveState(state);
}

function formatDate(timestamp) { return new Intl.DateTimeFormat("ja-JP", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(timestamp); }
function toast(message) { const el = $("#toast"); el.textContent = message; el.classList.add("show"); clearTimeout(toast.timer); toast.timer = setTimeout(() => el.classList.remove("show"), 1800); }

elements.form.addEventListener("submit", (event) => { event.preventDefault(); const name = elements.input.value.trim(); if (!name) return; state.items.unshift(createItem(name, elements.category.value)); elements.input.value = ""; render(); elements.input.focus(); toast("リストに追加しました"); });
elements.list.addEventListener("click", (event) => { const row = event.target.closest(".item"); if (!row) return; const item = state.items.find((entry) => entry.id === row.dataset.id); if (event.target.matches(".check")) { item.completed = event.target.checked; if (item.completed) state.history.unshift({ ...item, boughtAt: Date.now() }); else state.history = state.history.filter((record) => record.id !== item.id); render(); } if (event.target.matches(".delete-button")) { state.items = state.items.filter((entry) => entry.id !== item.id); render(); toast("アイテムを削除しました"); } });
$("#clearButton").addEventListener("click", () => { const count = state.items.filter((item) => item.completed).length; if (!count) return toast("購入済みのアイテムはありません"); state.items = state.items.filter((item) => !item.completed); render(); toast(`${count}件をリストから整理しました`); });
$("#clearHistoryButton").addEventListener("click", () => { state.history = []; render(); toast("買い物記録をクリアしました"); });
$("#today").textContent = new Intl.DateTimeFormat("ja-JP", { year: "numeric", month: "long", day: "numeric", weekday: "short" }).format(new Date());
render();
