export function log(text) {
  let line = document.createElement("div");
  line.className = "line";
  line.innerHTML = text;
  document.getElementById("log").appendChild(line);
};
