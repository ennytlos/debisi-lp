const appData = [
  {
    title: "Social Media Security",
    desc: "Stop living in fear of losing your hard-earned audience. We keep your business presence safe and unshakable.",
    img: "images/security.png",
  },
  {
    title: "Local First Visibility",
    desc: "Stop being a 'ghost' in Ibadan. We make sure every neighbor looking for what you sell finds YOU first.",
    img: "images/visibility.png",
  },
  {
    title: "Lead Generation",
    desc: "Wake up to a flooded inbox. We drive real customers in Ibadan directly to your WhatsApp and store.",
    img: "images/leads.png",
  },
  {
    title: "Marketplace Sales",
    desc: "Sell with zero stress. List your products and let our secure marketplace handle the trust factor for you.",
    img: "images/marketplace.png",
  },
];

let currentIdx = 0;

function openGame() {
  document.getElementById("gameModal").classList.add("active");
  currentIdx = 0; // Reset
  renderCard();
  document.getElementById("carouselPart").style.display = "block";
  document.getElementById("emailPart").classList.remove("active");
}

function closeGame() {
  document.getElementById("gameModal").classList.remove("active");
}

function showUpcoming(action) {
  const title =
    action === "Login" ? "Login Coming Soon" : "Get Started Coming Soon";
  const text =
    action === "Login"
      ? "Login is not available yet. See what is coming next and join the waitlist."
      : 'Get Started is coming soon. Click "See What\'s Coming" to join the waitlist.';
  document.getElementById("upcomingTitle").innerText = title;
  document.getElementById("upcomingText").innerText = text;
  document.getElementById("upcomingModal").classList.add("active");
}

function closeUpcoming() {
  document.getElementById("upcomingModal").classList.remove("active");
}

function renderCard() {
  const data = appData[currentIdx];
  const imgEl = document.getElementById("cardImage");
  const titleEl = document.getElementById("cardTitle");
  const descEl = document.getElementById("cardDesc");

  // Add a small fade effect via JS if needed, but CSS is better
  imgEl.src = data.img;
  titleEl.innerText = data.title;
  descEl.innerText = data.desc;

  // Update dots dynamically
  const dots = document.querySelectorAll(".dot");
  dots.forEach((dot, index) => {
    dot.className = index === currentIdx ? "dot active" : "dot";
  });
}

function handleChoice() {
  if (currentIdx < appData.length - 1) {
    currentIdx++;
    renderCard();
  } else {
    // Show Email Step (Hook)
    document.getElementById("carouselPart").style.display = "none";
    document.getElementById("emailPart").classList.add("active");
  }
}

function finishLead(e) {
  // No longer collecting email, just close or redirect if needed
  // Since it's now a link, this function is not called
}
