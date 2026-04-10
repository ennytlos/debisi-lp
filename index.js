// ─── Firebase Configuration ───
const firebaseConfig = {
  apiKey: "AIzaSyCXQP2CSB2SqwJ89yp-b_4cBJadQW-WsVA",
  authDomain: "debisi-cp.firebaseapp.com",
  projectId: "debisi-cp",
  storageBucket: "debisi-cp.firebasestorage.app",
  messagingSenderId: "237978450465",
  appId: "1:237978450465:web:d5456e38c8a7ee84ef4160",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ─── Session ID (unique per visitor session) ───
const sessionId =
  "session_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9);

// ─── App Data ───
const appData = [
  {
    title: "Social Media Security",
    desc: "Stop living in fear of losing your hard-earned business accounts and followers. We keep your business presence safe and unshakable.",
    img: "images/security.png",
  },
  {
    title: "Local First Visibility",
    desc: "Stop being a 'ghost' in Ibadan. We make sure every neighbor looking for what you sell finds YOU first.",
    img: "images/visibility.png",
  },
  {
    title: "Lead Generation",
    desc: "Wake up to a flooded inbox. We drive real customers in Ibadan and beyond directly to your preferred contact and store.",
    img: "images/leads.png",
  },
  {
    title: "Marketplace Sales",
    desc: "Sell with zero stress. List your products and let our secure marketplace handle the connection and trust factor for you.",
    img: "images/marketplace.png",
  },
];

let currentIdx = 0;
const sessionVotes = []; // Track votes locally for this session

// ─── Modal Controls ───
function openGame() {
  document.getElementById("gameModal").classList.add("active");
  currentIdx = 0;
  sessionVotes.length = 0; // Reset votes for new session
  renderCard();
  document.getElementById("carouselPart").style.display = "block";
  document.getElementById("emailPart").classList.remove("active");

  // Reset the email form if it exists
  const form = document.getElementById("leadForm");
  if (form) form.reset();
  const btn = document.getElementById("leadSubmitBtn");
  if (btn) {
    btn.disabled = false;
    btn.textContent = "Hook me up with @debisi.ng";
  }
}

function closeGame() {
  document.getElementById("gameModal").classList.remove("active");
}

function showUpcoming(action) {
  const title = action === "Login" ? "Login Coming Soon" : "Coming Soon";
  const text =
    action === "Login"
      ? "Login is not available yet. See what is coming next and join the waitlist."
      : 'Debisi is coming soon. Click "See What\'s Coming" to join the waitlist.';
  document.getElementById("upcomingTitle").innerText = title;
  document.getElementById("upcomingText").innerText = text;
  document.getElementById("upcomingModal").classList.add("active");
}

function closeUpcoming() {
  document.getElementById("upcomingModal").classList.remove("active");
}

// ─── Carousel Rendering ───
function renderCard() {
  const data = appData[currentIdx];
  const imgEl = document.getElementById("cardImage");
  const titleEl = document.getElementById("cardTitle");
  const descEl = document.getElementById("cardDesc");

  imgEl.src = data.img;
  titleEl.innerText = data.title;
  descEl.innerText = data.desc;

  // Update dots
  const dots = document.querySelectorAll(".dot");
  dots.forEach((dot, index) => {
    dot.className = index === currentIdx ? "dot active" : "dot";
  });
}

// ─── Dot Navigation ───
function goToCard(index) {
  if (index >= 0 && index < appData.length) {
    currentIdx = index;
    renderCard();
  }
}

// ─── Smash / Pass Handler ───
function handleChoice(choice) {
  const feature = appData[currentIdx].title;

  // Record vote to Firestore
  db.collection("votes")
    .add({
      feature: feature,
      choice: choice,
      sessionId: sessionId,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    })
    .catch((err) => console.error("Vote save error:", err));

  // Track locally
  sessionVotes.push({ feature, choice });

  // Advance or show email step
  if (currentIdx < appData.length - 1) {
    currentIdx++;
    renderCard();
  } else {
    document.getElementById("carouselPart").style.display = "none";
    document.getElementById("emailPart").classList.add("active");
  }
}

// ─── Email Lead Submission ───
function submitLead(e) {
  e.preventDefault();

  const emailInput = document.getElementById("leadEmail");
  const submitBtn = document.getElementById("leadSubmitBtn");
  const email = emailInput.value.trim();

  // No email? Just go to Instagram
  if (!email) {
    window.open("https://instagram.com/debisi.ng", "_blank");
    closeGame();
    return;
  }

  // Show loading state
  submitBtn.disabled = true;
  submitBtn.textContent = "Submitting...";

  // Save lead to Firestore
  db.collection("leads")
    .add({
      email: email,
      sessionId: sessionId,
      votes: sessionVotes,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    })
    .then(() => {
      submitBtn.textContent = "Redirecting... ✓";
      // Redirect to Instagram after a brief moment
      setTimeout(() => {
        window.open("https://instagram.com/debisi.ng", "_blank");
        closeGame();
      }, 600);
    })
    .catch((err) => {
      console.error("Lead save error:", err);
      submitBtn.disabled = false;
      submitBtn.textContent = "Hook me up with @debisi.ng";
      alert("Something went wrong. Please try again.");
    });
}
