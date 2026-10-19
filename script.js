// OASIS LOCKED ASSET LOADER
async function loadOasisBase64Asset(paths) {
  const parts = await Promise.all(paths.map(async (path) => {
    const response = await fetch(path, { cache: "no-store" });
    if (!response.ok) throw new Error("Could not load " + path);
    return (await response.text()).trim();
  }));
  return parts.join("");
}

async function loadLockedOasisVisuals() {
  try {
    const [celebration, family, background] = await Promise.all([
      loadOasisBase64Asset([
        "assets/celebration-1.b64",
        "assets/celebration-2.b64",
        "assets/celebration-3.b64",
        "assets/celebration-3b.b64",
        "assets/celebration-4.b64",
        "assets/celebration-5.b64"
      ]),
      loadOasisBase64Asset([
        "assets/family-1.b64",
        "assets/family-2.b64",
        "assets/family-3.b64",
        "assets/family-4.b64"
      ]),
      loadOasisBase64Asset([
        "assets/background-1.b64",
        "assets/background-2.b64",
        "assets/background-3.b64",
        "assets/background-4.b64",
        "assets/background-5.b64"
      ])
    ]);

    const celebrationImage = document.getElementById("celebrationServiceImage");
    const familyImage = document.getElementById("familyServiceImage");

    if (celebrationImage) {
      celebrationImage.src = "data:image/jpeg;base64," + celebration;
    }
    if (familyImage) {
      familyImage.src = "data:image/jpeg;base64," + family;
    }

    document.documentElement.style.setProperty(
      "--oasis-page-sky",
      'url("data:image/jpeg;base64,' + background + '")'
    );
  } catch (error) {
    console.warn("Oasis visual assets could not be loaded:", error);
  }
}

/* =========================================================
   OASIS WORLD TVL — INTERACTIVE FRONTEND
   =========================================================

   LIVE DATA SWAP POINTS:
   1) Travel Search:
      The live buttons in index.html open Google Flights, Google Hotels,
      and KAYAK Cars in new tabs. The #third-party-travel-widget mount
      remains staged for the future Oasis Travelpayouts White Label.
      Paste only Michelle's own partner/publisher embed code there.

   2) Lead Capture Form:
      The form submits directly to FormSubmit and emails Michelle at
      oasisworldtvl@gmail.com, including the uploaded screenshot/itinerary.

   3) AI Concierge:
      Replace getSimulatedAIReply() with a secure server-side
      AI/API call. Never expose private API keys in this file.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {\n  loadLockedOasisVisuals();
  const leadForm = document.getElementById("oasisLeadForm");
  const formStatus = document.getElementById("formStatus");
  const tripDetails = document.getElementById("tripDetails");
  const tripScreenshot = document.getElementById("tripScreenshot");
  const uploadFileName = document.getElementById("uploadFileName");

  const chatToggle = document.getElementById("aiChatToggle");
  const chatPanel = document.getElementById("aiChatPanel");
  const chatClose = document.getElementById("aiChatClose");
  const chatForm = document.getElementById("aiChatForm");
  const chatInput = document.getElementById("aiChatInput");
  const messageLog = document.getElementById("aiMessageLog");

  const params = new URLSearchParams(window.location.search);
  if (params.get("submitted") === "1" && formStatus) {
    formStatus.textContent = "💜 Thank you! Your Oasis World TVL inquiry was submitted. Michelle will follow up with you.";
  }

  function scrollToLeadForm(prefillText = "") {
    if (prefillText && tripDetails) {
      const existing = tripDetails.value.trim();
      tripDetails.value = existing
        ? existing + "\n\nAI Concierge notes: " + prefillText
        : "AI Concierge notes: " + prefillText;
    }

    document.getElementById("lead-form")?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

    window.setTimeout(() => {
      tripDetails?.focus();
    }, 650);
  }

  // Smooth-scroll all ordinary links that target the lead form.
  document.querySelectorAll('a[href="#lead-form"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      scrollToLeadForm();
    });
  });

  tripScreenshot?.addEventListener("change", () => {
    const file = tripScreenshot.files?.[0];
    if (uploadFileName) {
      uploadFileName.textContent = file ? "Selected: " + file.name : "";
    }
  });

  // ---------------------------------------------------------
  // LIVE FORM SUBMISSION
  // Native browser submission now posts directly to FormSubmit.
  // Do not preventDefault here, or the email/file upload will not send.
  // ---------------------------------------------------------

  function setChatOpen(open) {
    if (!chatPanel || !chatToggle) return;
    chatPanel.classList.toggle("hidden", !open);
    chatToggle.setAttribute("aria-expanded", String(open));
    if (open) {
      window.setTimeout(() => chatInput?.focus(), 100);
    }
  }

  chatToggle?.addEventListener("click", () => {
    const currentlyOpen = !chatPanel.classList.contains("hidden");
    setChatOpen(!currentlyOpen);
  });

  chatClose?.addEventListener("click", () => setChatOpen(false));

  function appendMessage(text, role = "bot") {
    const bubble = document.createElement("div");
    bubble.className = "ai-message " + role;
    bubble.textContent = text;
    messageLog.appendChild(bubble);
    messageLog.scrollTop = messageLog.scrollHeight;
    return bubble;
  }

  function appendRoutingLink(tripIdeaText) {
    const wrapper = document.createElement("div");
    wrapper.className = "ai-message bot";

    const intro = document.createElement("div");
    intro.textContent =
      "I've saved these trip ideas for Oasis World Travel!";

    const link = document.createElement("a");
    link.href = "#lead-form";
    link.className = "ai-routing-link";
    link.textContent =
      "Click here to send your details to our lead booking agent so she can lock in your dates.";

    link.addEventListener("click", (event) => {
      event.preventDefault();
      setChatOpen(false);
      scrollToLeadForm(tripIdeaText);
    });

    wrapper.appendChild(intro);
    wrapper.appendChild(link);
    messageLog.appendChild(wrapper);
    messageLog.scrollTop = messageLog.scrollHeight;
  }

  // ---------------------------------------------------------
  // FRONTEND AI SIMULATION ONLY
  // Replace this with a secure server-side AI/API call later.
  // ---------------------------------------------------------
  function getSimulatedAIReply(userText) {
    const normalized = userText.toLowerCase();

    if (normalized.includes("cruise")) {
      return "A cruise could be a beautiful fit. I’d compare departure port, sailing length, cabin type, onboard vibe, and whether you want relaxation, family fun, or nightlife.";
    }

    if (normalized.includes("all-inclusive") || normalized.includes("resort")) {
      return "For an all-inclusive escape, I’d narrow it by destination, adults-only vs. family-friendly, preferred resort style, beach quality, dining, and your total trip budget.";
    }

    if (normalized.includes("flight") || normalized.includes("hotel")) {
      return "For a flight-and-hotel trip, I’d organize your dates, departure city, destination, hotel style, preferred flight times, and flexibility so Michelle can compare the strongest options.";
    }

    return "That sounds like a great starting point. I’d organize your destination, travel dates, number of travelers, approximate budget, must-have experiences, and how flexible you are before Michelle reviews it with you.";
  }

  chatForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    const userText = chatInput.value.trim();
    if (!userText) return;

    appendMessage(userText, "user");
    chatInput.value = "";

    window.setTimeout(() => {
      appendMessage(getSimulatedAIReply(userText), "bot");

      window.setTimeout(() => {
        appendRoutingLink(userText);
      }, 450);
    }, 500);
  });
});