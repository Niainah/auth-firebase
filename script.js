import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: import.meta.env.VITE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_APP_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginEmailBtn = document.getElementById("loginEmailBtn");
const signupBtn = document.getElementById("signupBtn");
const loginGoogleBtn = document.getElementById("loginGoogleBtn");
const logoutBtn = document.getElementById("logoutBtn");
const userInfoDiv = document.getElementById("userInfo");
const userPhoto = document.getElementById("userPhoto");
const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");
const errorMessage = document.getElementById("errorMessage");

loginEmailBtn.addEventListener("click", () => {
    const email = emailInput.value;
    const password = passwordInput.value;

    if (!email || !password) {
        errorMessage.textContent = "Veuillez remplir tous les champs.";
        return;
    }

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            updateUI(user);
            errorMessage.textContent = "";
        })
        .catch((error) => {
            console.error("Erreur de connexion :", error);
            errorMessage.textContent = "Erreur de connexion : " + error.message;
        });
});

signupBtn.addEventListener("click", () => {
    const email = emailInput.value;
    const password = passwordInput.value;

    if (!email || !password) {
        errorMessage.textContent = "Veuillez remplir tous les champs.";
        return;
    }

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            updateUI(user);
            errorMessage.textContent = "";
        })
        .catch((error) => {
            console.error("Erreur de création de compte :", error);
            errorMessage.textContent = "Erreur de création de compte : " + error.message;
        });
});

loginGoogleBtn.addEventListener("click", () => {
    signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            updateUI(user);
            errorMessage.textContent = "";
        })
        .catch((error) => {
            console.error("Erreur de connexion Google :", error);
            errorMessage.textContent = "Erreur de connexion Google : " + error.message;
        });
});

logoutBtn.addEventListener("click", () => {
    signOut(auth)
        .then(() => {
            updateUI(null);
            errorMessage.textContent = "";
        })
        .catch((error) => {
            console.error("Erreur de déconnexion :", error);
            errorMessage.textContent = "Erreur de déconnexion : " + error.message;
        });
});

onAuthStateChanged(auth, (user) => {
    updateUI(user);
});

function updateUI(user) {
    if (user) {
        loginEmailBtn.style.display = "none";
        signupBtn.style.display = "none";
        loginGoogleBtn.style.display = "none";
        logoutBtn.style.display = "block";
        userInfoDiv.style.display = "block";

        userPhoto.src = user.photoURL || "";
        userName.textContent = user.displayName || "";
        userEmail.textContent = user.email;

        emailInput.value = "";
        passwordInput.value = "";
    } else {
        loginEmailBtn.style.display = "block";
        signupBtn.style.display = "block";
        loginGoogleBtn.style.display = "block";
        logoutBtn.style.display = "none";
        userInfoDiv.style.display = "none";

        userPhoto.src = "";
        userName.textContent = "";
        userEmail.textContent = "";
    }
}