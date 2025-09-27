// ====== UŽIVATELÉ ======
let users = JSON.parse(localStorage.getItem("users")) || [
  { name: "Červeňák Dominik", pass: "Dominik2014.", role: "admin", created: new Date(), active: null }
];
let currentUser = null;

// ====== LOGIN / REGISTRACE ======
function login() {
  const name = document.getElementById("loginName").value.trim();
  const pass = document.getElementById("loginPass").value;

  const user = users.find(u => u.name === name && u.pass === pass);
  if (user) {
    user.active = new Date();
    currentUser = user;
    localStorage.setItem("users", JSON.stringify(users));
    showMain();
  } else {
    alert("Špatné jméno nebo heslo!");
  }
}

function showRegister() {
  document.getElementById("loginScreen").classList.add("hidden");
  document.getElementById("registerScreen").classList.remove("hidden");
}

function showLogin() {
  document.getElementById("loginScreen").classList.remove("hidden");
  document.getElementById("registerScreen").classList.add("hidden");
}

function register() {
  const name = document.getElementById("regName").value.trim();
  const pass = document.getElementById("regPass").value;

  if (!name || !pass) return alert("Vyplňte jméno a heslo!");
  if (users.find(u => u.name === name)) return alert("Uživatel už existuje!");

  const newUser = { name, pass, role: "student", created: new Date(), active: null };
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));
  alert("Účet vytvořen, můžete se přihlásit.");
  showLogin();
}

function logout() {
  currentUser = null;
  document.getElementById("mainScreen").classList.add("hidden");
  document.getElementById("loginScreen").classList.remove("hidden");
}

// ====== HLAVNÍ OBSAH PODLE ROLE ======
function showMain() {
  document.getElementById("loginScreen").classList.add("hidden");
  document.getElementById("registerScreen").classList.add("hidden");
  document.getElementById("mainScreen").classList.remove("hidden");

  document.getElementById("currentUser").textContent = currentUser.name;
  document.getElementById("roleText").textContent = currentUser.role;

  // Skrývání / ukazování tlačítek
  document.getElementById("btnAddLesson").classList.toggle("hidden", currentUser.role === "student");
  document.getElementById("btnAddInfo").classList.toggle("hidden", currentUser.role === "student");
  document.getElementById("btnSupl").classList.toggle("hidden", currentUser.role === "student");
  document.getElementById("btnAddTask").classList.toggle("hidden", currentUser.role === "student");

  document.getElementById("btnUsers").classList.toggle("hidden", currentUser.role !== "admin");
  document.getElementById("btnAddTeacher").classList.toggle("hidden", currentUser.role !== "admin");
}

// ====== SEKCÍ PŘEPÍNÁNÍ ======
function showSection(id) {
  ["scheduleSection", "gradesSection", "tasksSection", "messagesSection"]
    .forEach(sec => document.getElementById(sec).classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

// ====== ROZVRH ======
function addLessonForm() {
  const den = prompt("Den:");
  const cas = prompt("Od kdy do kdy:");
  const ucitel = currentUser.name;
  const predmet = prompt("Předmět:");
  const zkratka = prompt("Zkratka předmětu:");

  if (!den || !cas || !predmet || !zkratka) return;

  const lessons = JSON.parse(localStorage.getItem("lessons")) || [];
  lessons.push({ den, cas, ucitel, predmet, zkratka });
  localStorage.setItem("lessons", JSON.stringify(lessons));
  alert("Hodina přidána!");
}

function addInfoForm() {
  const hodina = prompt("Hodina:");
  const info = prompt("Informace:");
  if (!hodina || !info) return;
  alert(`Informace uložena: ${hodina} - ${info}`);
}

function addSuplForm() {
  const hodina = prompt("Hodina:");
  const ucitel = prompt("Učitel supluje:");
  if (!hodina || !ucitel) return;
  alert(`Suplování uloženo: ${hodina} supluje ${ucitel}`);
}

// ====== ÚKOLY ======
function addTaskForm() {
  const hodina = prompt("Hodina:");
  const kdy = prompt("Na kdy:");
  const ukol = prompt("Jaký úkol:");
  if (!hodina || !kdy || !ukol) return;

  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push({ hodina, kdy, ukol });
  localStorage.setItem("tasks", JSON.stringify(tasks));

  document.getElementById("tasks").innerHTML += `
    <div><b>${hodina}</b> – do ${kdy}<br>${ukol}</div><hr>
  `;
}

// ====== UŽIVATELÉ (jen admin) ======
function showUsers() {
  let html = "<h3>Uživatelé</h3>";
  users.forEach(u => {
    html += `<div><b>${u.name}</b> | heslo: ${u.pass} | role: ${u.role} | vytvořen: ${u.created} | aktivní: ${u.active}</div>`;
  });
  document.getElementById("content").innerHTML = html;
}

function addTeacherForm() {
  const name = prompt("Jméno účtu:");
  const pass = prompt("Heslo účtu:");
  const user = users.find(u => u.name === name && u.pass === pass);
  if (!user) return alert("Účet nenalezen!");
  user.role = "teacher";
  localStorage.setItem("users", JSON.stringify(users));
  alert("Uživatel povýšen na učitele!");
}

// ====== ZPRÁVY ======
function sendMessage(to, text) {
  const messages = JSON.parse(localStorage.getItem("messages")) || [];
  messages.push({ from: currentUser.name, to, text, time: new Date() });
  localStorage.setItem("messages", JSON.stringify(messages));
  alert("Zpráva odeslána!");
}

function loadMessages() {
  const messages = JSON.parse(localStorage.getItem("messages")) || [];
  const myMessages = messages.filter(m => m.to === currentUser.name || m.from === currentUser.name);
  let html = "";
  myMessages.forEach(m => {
    html += `<div><b>${m.from}</b> → <b>${m.to}</b>: ${m.text}</div>`;
  });
  document.getElementById("messages").innerHTML = html || "Žádné zprávy";
}

