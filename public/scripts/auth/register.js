const registerForm = document.querySelector(".auth-form form");
const usernameInput = registerForm.querySelector('input[name="username"]');
const emailInput = registerForm.querySelector('input[type="email"]');
const passwordInput = registerForm.querySelector('input[type="password"]');
const submitBtn = registerForm.querySelector("button");
const loadingSpinner = registerForm.querySelector(".wheel");
const checkmark = registerForm.querySelector(".checkmark");

registerForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const formData = {
    username: usernameInput.value,
    email: emailInput.value,
    password: passwordInput.value,
  };

  submitBtn.style.display = "none";
  loadingSpinner.style.display = "flex";

  try {
    if (formData.password.length < 8) {
      showNotification(
        "Password must be at least 8 characters",
        "var(--error-color)"
      );
      return;
    }
    const response = await fetch("/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      showNotification(errorData.error, "var(--error-color)");
    } else {
      loadingSpinner.style.display = "none";
      submitBtn.style.display = "none";
      checkmark.style.display = "block";
      setTimeout(() => {
        window.location.href = "/auth/login";
        return;
      }, 2000);
    }
  } catch (error) {
    showNotification(error, "var(--error-color)");
  } finally {
    // Reset form state if we haven't redirected
    submitBtn.style.display = "block";
    loadingSpinner.style.display = "none";
  }
});
