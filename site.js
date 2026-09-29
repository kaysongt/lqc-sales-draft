(function () {
  var form = document.getElementById("contact");
  var success = document.getElementById("inquiry-success");
  var draft = document.getElementById("draft-link");
  var again = document.getElementById("write-another");
  if (!form || !success) return;

  function field(name) {
    var el = form.elements[name];
    return el ? String(el.value || "").replace(/\s+/g, " ").trim() : "";
  }

  function draftHref() {
    var lines = [
      "Latin Quarter Collective — partnership inquiry",
      "",
      "Name: " + field("name"),
      "Email: " + field("email"),
      "Organization: " + field("organization"),
      "",
      field("message")
    ];
    return (
      "mailto:?subject=" +
      encodeURIComponent("Latin Quarter Collective — partnership inquiry") +
      "&body=" +
      encodeURIComponent(lines.join("\n"))
    );
  }

  function syncDraft() {
    if (draft) draft.href = draftHref();
  }

  form.addEventListener("input", syncDraft);
  syncDraft();

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var name = field("name");
    var email = field("email");
    var org = field("organization");
    var message = field("message");
    if (!name || !email || !org || !message) {
      form.reportValidity();
      return;
    }
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    success.querySelector("[data-name]").textContent = name;
    success.querySelector("[data-org]").textContent = org;
    success.querySelector("[data-email]").textContent = email;
    syncDraft();
    form.hidden = true;
    success.hidden = false;
    var heading = success.querySelector("h3");
    if (heading) heading.focus();
  });

  if (again) {
    again.addEventListener("click", function () {
      success.hidden = true;
      form.hidden = false;
      var first = form.querySelector("input[name='name']");
      if (first) first.focus();
    });
  }
})();
