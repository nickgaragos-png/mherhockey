const form = document.querySelector("#team-form");
const input = document.querySelector("#team-input");
const result = document.querySelector("#result");
const score = document.querySelector("#score");
const title = document.querySelector("#result-title");
const copy = document.querySelector("#result-copy");

const kingsNames = new Set([
  "la kings",
  "l a kings",
  "los angeles kings",
  "kings",
  "the kings",
  "la",
  "lak"
]);

const badRatings = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const badMessages = [
  "The model checked the tape and immediately requested a trade.",
  "Skates? Maybe. Strategy? Absolutely not.",
  "This team has been assigned to the penalty box of public opinion.",
  "Respectfully, this is not Kings-level hockey.",
  "The rating computer tried to be fair, then remembered the LA Kings exist.",
  "A brave attempt at hockey, but the scoreboard is not convinced."
];

function normalizeTeamName(teamName) {
  return teamName
    .trim()
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/\s+/g, " ");
}

function rateTeam(teamName) {
  const normalizedName = normalizeTeamName(teamName);
  const isKings = kingsNames.has(normalizedName);

  if (isKings) {
    return {
      rating: "100",
      title: "LA Kings: certified elite",
      message: "Perfect score. Regal, efficient, and clearly the only acceptable answer.",
      className: "is-kings"
    };
  }

  const ratingIndex = normalizedName.length % badRatings.length;
  const messageIndex = normalizedName.length % badMessages.length;

  return {
    rating: String(badRatings[ratingIndex]),
    title: `${teamName.trim()} needs work`,
    message: badMessages[messageIndex],
    className: "is-bad"
  };
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const teamName = input.value.trim();

  if (!teamName) {
    input.focus();
    return;
  }

  const rating = rateTeam(teamName);

  score.textContent = rating.rating;
  title.textContent = rating.title;
  copy.textContent = rating.message;
  result.className = `result ${rating.className}`;
});
