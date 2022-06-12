const checkbox = document.getElementById("checkbox");
const body = document.body;
checkbox.addEventListener("change", () => {
  if (body.classList.contains("dark")) {
    body.classList.toggle("light");
  } else {
    body.classList.toggle("dark");
  }
});