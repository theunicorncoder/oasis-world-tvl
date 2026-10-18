/* =========================================================
   OASIS WORLD TVL — INTERACTIVE FRONTEND
   =========================================================

   LIVE DATA SWAP POINTS:
   1) Travel Search:
      The live buttons in index.html currently open Google Flights,
      Google Hotels, and KAYAK Cars. The #third-party-travel-widget
      block is reserved for the future Oasis Travelpayouts White Label.
      Paste only the user's own Travelpayouts embed code/partner marker.

   2) Lead Capture Form:
      Replace the demo submit handler below with your Jotform,
      CRM, Formspree, Cloudflare Worker, or custom API endpoint.

   3) AI Concierge:
      Replace getSimulatedAIReply() with a secure server-side
      AI/API call. Never expose private API keys in this file.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const leadForm = document.getElementById("oasisLeadForm");
  const formStatus = document.getElementById("formStatus");
  const tripDetails = document.getElementById("tripDetails");

  const chatToggle = document.getElementById("aiChatToggle");
  const chatPanel = document.getElementById("aiChatPanel");
  const chatClose = document.getElementById("aiChatClose");
  const chatForm = document.getElementById("aiChatForm");
  const chatInput = document.getElementById("aiChatInput");
  const messageLog = document.getElementById("aiMessageLog");

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

  // ---------------------------------------------------------
  // LEAD FORM DEMO SUBMISSION
  // Replace this block later with your live form endpoint.
  // ---------------------------------------------------------
  leadForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    formStatus.textContent =
      "💜 Thanks! Your trip details are ready for the Oasis World TVL team. Live form delivery will be connected next.";

    // FUTURE LIVE FORM EXAMPLE:
    // const formData = new FormData(leadForm);
    // fetch("YOUR_LIVE_ENDPOINT", { method: "POST", body: formData })
    //   .then(...)
    //   .catch(...);
  });

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