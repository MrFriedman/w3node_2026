(function () {
  var toggle = document.querySelector("[data-nav-toggle]");
  var links = document.querySelector("[data-nav-links]");
  var label = document.querySelector(".nav-toggle-label");
  if (!toggle || !links) return;

  function setOpen(open) {
    links.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.classList.toggle("nav-open", open);
    if (label) label.textContent = open ? "Close" : "Menu";
  }

  toggle.addEventListener("click", function () {
    setOpen(!links.classList.contains("is-open"));
  });

  links.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      setOpen(false);
    });
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") setOpen(false);
  });
})();
