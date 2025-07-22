function toggleContainerContent(button) {
  const contentDiv = button.parentElement.nextElementSibling;
  const isHidden =
    contentDiv.style.display === "none" || contentDiv.style.display === "";
  contentDiv.style.display = isHidden ? "block" : "none";
  button.textContent = isHidden ? "⮟" : "⮜";
}
