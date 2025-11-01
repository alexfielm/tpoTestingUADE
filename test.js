const USERS_KEY = "users";
function loadUsers() {
  const raw = localStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : [];
}
function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function registerUser(email, password) {
  const users = loadUsers();
  const emailRegex = /^[^\s@]+@gmail\.com$/;
  if (!email || !password)
      return { ok: false, msg: "Completá todos los campos." };
  if (!emailRegex.test(email))
      return { ok: false, msg: "Ingresá un email válido (ejemplo: usuario@gmail.com)." };
  if (users.some(u => u.email === email))
      return { ok: false, msg: "El email ya está registrado." };
  if (password.length < 6)
      return { ok: false, msg: "La contraseña debe tener al menos 6 caracteres." };
  users.push({ email, password });
  saveUsers(users);
  return { ok: true, msg: "Usuario registrado con éxito ✅" };
}

function loginUser(email, password) {
  const users = loadUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return { ok: false, msg: "Credenciales incorrectas ❌" };
  sessionStorage.setItem("sessionUser", JSON.stringify(user));
  return { ok: true, msg: "Inicio de sesión exitoso 👋" };
}

function logoutUser() {
  sessionStorage.removeItem("sessionUser");
}

function getCurrentUser() {
  const raw = sessionStorage.getItem("sessionUser");
  return raw ? JSON.parse(raw) : null;
}

const msg = document.getElementById("msg");
const btnRegister = document.getElementById("btnRegister");
const btnLogin = document.getElementById("btnLogin");
const btnLogout = document.getElementById("btnLogout");

btnRegister.addEventListener("click", () => {
  const email = document.getElementById("email").value.trim();
  const pass = document.getElementById("password").value;
  const res = registerUser(email, pass);
  msg.textContent = res.msg;
  msg.className = res.ok ? "ok" : "error";
});

btnLogin.addEventListener("click", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const pass = document.getElementById("password").value;
  const res = loginUser(email, pass);
  msg.textContent = res.msg;
  msg.className = res.ok ? "ok" : "error";
  if (res.ok) {
    btnLogout.style.display = "block";
    window.location.href = "./catalogo/menu-principal.html";
  }
});

btnLogout.addEventListener("click", () => {
  logoutUser();
  msg.textContent = "Sesión cerrada.";
  msg.className = "";
  btnLogout.style.display = "none";
});

const user = getCurrentUser();
if (user) {
  msg.textContent = `Sesión activa: ${user.email}`;
  msg.className = "ok";
  btnLogout.style.display = "block";
}
