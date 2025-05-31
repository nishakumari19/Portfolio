document.addEventListener("DOMContentLoaded", function () {
  document.querySelector(".year").textContent = (new Date().getFullYear());

  const form = document.getElementById('contactForm');
  const scrollButton = document.getElementById("scrollToTop");

  if (form) {
    form.addEventListener('submit', async function (event) {
      event.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();
      const responseMessage = document.getElementById('responseMessage');
      const submitBtn = document.getElementById('submitBtn');

      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";

      try {
        const response = await fetch('/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, message })
        });

        const result = await response.json();
        responseMessage.textContent = result.message;
        responseMessage.style.color = response.ok ? "green" : "red";

        if (response.ok) {
          form.reset();
          setTimeout(() => {
            responseMessage.textContent = "";
          }, 2000);
        }
      } catch (error) {
        responseMessage.textContent = "Error sending message. Try again.";
        responseMessage.style.color = "red";
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Send Message";
      }
    });
  }

  if (scrollButton) {
    window.addEventListener("scroll", function () {
      scrollButton.style.display = window.scrollY > 250 ? "block" : "none";
    });

    scrollButton.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  const text = "New Project Coming Soon...";
  let index = 0;
  function typeEffect() {
    const typingText = document.querySelector(".typing-text");
    if (typingText) {
      if (index < text.length) {
        typingText.innerHTML += text.charAt(index++);
        setTimeout(typeEffect, 100);
      } else {
        setTimeout(() => {
          typingText.innerHTML = "";
          index = 0;
          typeEffect();
        }, 1000);
      }
    }
  }
  typeEffect();
});
