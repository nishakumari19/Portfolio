document.querySelector(".year").textContent = (new Date().getFullYear());


document.getElementById('contactForm').addEventListener('submit', async function (event) {
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
      document.getElementById('contactForm').reset();

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


const scrollButton = document.getElementById("scrollToTop");

window.addEventListener("scroll", function () {
  if (window.scrollY > 250) {
    scrollButton.style.display = "block";
  } else {
    scrollButton.style.display = "none";
  }
});

scrollButton.addEventListener("click", function () {
  window.scrollTo({ top: 0, behavior: "smooth" });
});



function toggleMenu() {
  document.getElementById("nav-links").classList.toggle("active");
}
