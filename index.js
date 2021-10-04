const text = document.querySelector("#title");
const stripText = text.textContent;
const splitText = stripText.split("");
text.textContent = "";

for (const letter of splitText) {
  text.innerHTML += "<span>" + letter + "</span>";
}

let count = 0;
let timer = setInterval(onTick, 50);

function onTick() {
  const span = text.querySelectorAll("span")[count];
  span.classList.add("fade");
  count++;
  if (count === splitText.length) {
    complete();
    return;
  }
}
function complete() {
  clearInterval(timer);
  timer = null;
}

const titleLetters = document.querySelectorAll("span");
let newLetters = Array.from(titleLetters);

newLetters.forEach((letter) => {
  letter.addEventListener("click", getData);
});

function getData() {
  document.querySelector(".loading").style.display = "block";
  fetch("https://www.boredapi.com/api/activity")
    .then((res) => res.json())
    .then((act) => {
      const activity = {
        Activity: act.activity,
        Type: act.type,
        Participants: act.participants,
      };
      document.querySelector(".loading").style.display = "none";
      postAct(activity)
        .then((res) => res.json())
        .then((theAct) => addToList(theAct, "activities"));
    });
}

function postAct(activity) {
  return fetch("http://localhost:3000/activities", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(activity),
  });
}

function fetchActs() {
  fetch("http://localhost:3000/activities")
    .then((res) => res.json())
    .then((acts) =>
      acts.forEach((element) => addToList(element, "activities"))
    );
}
fetchActs();

function postFavorites(activity) {
  fetch("http://localhost:3000/favorites", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(activity),
  });
}

function deleteAct(id) {
  fetch(`http://localhost:3000/activities/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

function deleteFavorites(id) {
  fetch(`http://localhost:3000/favorites/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

function fetchFavorites() {
  fetch("http://localhost:3000/favorites")
    .then((res) => res.json())
    .then((acts) => acts.forEach((element) => addToList(element, "favorites")));
}
fetchFavorites();

function addToList(activity, list) {
  let activityList = document.querySelector(`#${list}`);
  let listItem = document.createElement("li");
  let activityInfo = document.createElement("ul");

  for (const key in activity) {
    if (key !== "id") {
      let activityContent = document.createElement("li");
      activityContent.innerHTML = `${key}: ${activity[key]}`;
      activityInfo.append(activityContent);
    }
  }

  listItem.append(activityInfo);
  activityList.append(listItem);

  const btn = document.createElement("button");

  if (list === "activities") {
    const deleteBtn = document.createElement("button");

    btn.textContent = "Add to Favorites";
    btn.addEventListener("click", (ev) => {
      addToList(activity, "favorites");
      deleteAct(activity.id);
      delete activity.id;
      postFavorites(activity);
      listItem.remove();
      ev.target.remove();
      deleteBtn.remove();
    });

    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", (ev) => {
      deleteAct(activity.id);
      listItem.remove();
      ev.target.remove();
      btn.remove();
      deleteBtn.remove();
    });
    activityList.append(deleteBtn);
  } else if (list === "favorites") {
    btn.textContent = "Delete";
    btn.addEventListener("click", () => {
      deleteFavorites(activity.id);
      listItem.remove();
      btn.remove();
    });
  }

  activityList.append(btn);
}
