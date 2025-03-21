const loginForm = document.querySelector(".auth-form form");
const emailInput = loginForm.querySelector('input[type="email"]');
const passwordInput = loginForm.querySelector('input[type="password"]');
const submitBtn = loginForm.querySelector("button");
const loadingSpinner = loginForm.querySelector(".lds-default").parentElement;
const checkmark = loginForm.querySelector(".checkmark");

loginForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const formData = {
    email: emailInput.value,
    password: passwordInput.value,
  };

  // Show loading state
  submitBtn.style.display = "none";
  loadingSpinner.style.display = "flex";

  try {
    const response = await fetch("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      showNotification(errorData.error, "var(--error-color)");
      setTimeout(() => {
        submitBtn.style.display = "block";
        loadingSpinner.style.display = "none";
      }, 1000);
    } else {
      loadingSpinner.style.display = "none";
      checkmark.style.display = "block";
      setTimeout(() => {
        window.location.href = "/";
        //return to stop execution
      }, 1500);
      return;
    }
  } catch (error) {
    showNotification(error, "var(--error-color)");
    submitBtn.style.display = "block";
    loadingSpinner.style.display = "none";
  }
});
