const form = document.querySelector("#team-form");
const input = document.querySelector("#team-input");
const result = document.querySelector("#result");
const score = document.querySelector("#score");
const title = document.querySelector("#result-title");
const copy = document.querySelector("#result-copy");
const teamOptions = document.querySelector("#team-options");

const nhlTeams = [
  {
    name: "Anaheim Ducks",
    rating: 31,
    aliases: ["anaheim", "ducks", "ana", "anaheim ducks"]
  },
  {
    name: "Boston Bruins",
    rating: 68,
    aliases: ["boston", "bruins", "bos", "boston bruins"]
  },
  {
    name: "Buffalo Sabres",
    rating: 34,
    aliases: ["buffalo", "sabres", "buf", "buffalo sabres"]
  },
  {
    name: "Calgary Flames",
    rating: 43,
    aliases: ["calgary", "flames", "cgy", "calgary flames"]
  },
  {
    name: "Carolina Hurricanes",
    rating: 82,
    aliases: ["carolina", "hurricanes", "canes", "car", "carolina hurricanes"]
  },
  {
    name: "Chicago Blackhawks",
    rating: 24,
    aliases: ["chicago", "blackhawks", "hawks", "chi", "chicago blackhawks"]
  },
  {
    name: "Colorado Avalanche",
    rating: 86,
    aliases: ["colorado", "avalanche", "avs", "col", "colorado avalanche"]
  },
  {
    name: "Columbus Blue Jackets",
    rating: 40,
    aliases: ["columbus", "blue jackets", "jackets", "cbj", "columbus blue jackets"]
  },
  {
    name: "Dallas Stars",
    rating: 84,
    aliases: ["dallas", "stars", "dal", "dallas stars"]
  },
  {
    name: "Detroit Red Wings",
    rating: 49,
    aliases: ["detroit", "red wings", "wings", "det", "detroit red wings"]
  },
  {
    name: "Edmonton Oilers",
    rating: 88,
    aliases: ["edmonton", "oilers", "edm", "edmonton oilers"]
  },
  {
    name: "Florida Panthers",
    rating: 90,
    aliases: ["florida", "panthers", "fla", "florida panthers"]
  },
  {
    name: "Los Angeles Kings",
    rating: 100,
    aliases: ["la kings", "l a kings", "los angeles", "los angeles kings", "kings", "lak"]
  },
  {
    name: "Minnesota Wild",
    rating: 58,
    aliases: ["minnesota", "wild", "min", "minnesota wild"]
  },
  {
    name: "Montreal Canadiens",
    rating: 47,
    aliases: ["montreal", "canadiens", "habs", "mtl", "montreal canadiens"]
  },
  {
    name: "Nashville Predators",
    rating: 44,
    aliases: ["nashville", "predators", "preds", "nsh", "nashville predators"]
  },
  {
    name: "New Jersey Devils",
    rating: 73,
    aliases: ["new jersey", "devils", "nj", "njd", "new jersey devils"]
  },
  {
    name: "New York Islanders",
    rating: 46,
    aliases: ["new york islanders", "islanders", "isles", "nyi"]
  },
  {
    name: "New York Rangers",
    rating: 74,
    aliases: ["new york rangers", "rangers", "nyr"]
  },
  {
    name: "Ottawa Senators",
    rating: 52,
    aliases: ["ottawa", "senators", "sens", "ott", "ottawa senators"]
  },
  {
    name: "Philadelphia Flyers",
    rating: 42,
    aliases: ["philadelphia", "flyers", "phi", "philadelphia flyers"]
  },
  {
    name: "Pittsburgh Penguins",
    rating: 45,
    aliases: ["pittsburgh", "penguins", "pens", "pit", "pittsburgh penguins"]
  },
  {
    name: "San Jose Sharks",
    rating: 18,
    aliases: ["san jose", "sharks", "sjs", "san jose sharks"]
  },
  {
    name: "Seattle Kraken",
    rating: 39,
    aliases: ["seattle", "kraken", "sea", "seattle kraken"]
  },
  {
    name: "St. Louis Blues",
    rating: 55,
    aliases: ["st louis", "saint louis", "blues", "stl", "st louis blues"]
  },
  {
    name: "Tampa Bay Lightning",
    rating: 79,
    aliases: ["tampa bay", "tampa", "lightning", "bolts", "tbl", "tampa bay lightning"]
  },
  {
    name: "Toronto Maple Leafs",
    rating: 80,
    aliases: ["toronto", "maple leafs", "leafs", "tor", "toronto maple leafs"]
  },
  {
    name: "Utah Mammoth",
    rating: 50,
    aliases: ["utah", "mammoth", "uta", "utah mammoth"]
  },
  {
    name: "Vancouver Canucks",
    rating: 64,
    aliases: ["vancouver", "canucks", "van", "vancouver canucks"]
  },
  {
    name: "Vegas Golden Knights",
    rating: 83,
    aliases: ["vegas", "golden knights", "knights", "vgk", "vegas golden knights"]
  },
  {
    name: "Washington Capitals",
    rating: 63,
    aliases: ["washington", "capitals", "caps", "wsh", "washington capitals"]
  },
  {
    name: "Winnipeg Jets",
    rating: 78,
    aliases: ["winnipeg", "jets", "wpg", "winnipeg jets"]
  }
];

const nonKingsMessages = [
  "Real NHL team found. Still not Kings-level, but the database admits they exist.",
  "Confirmed NHL team. The model gave them a fair score, then deducted points for not being LA.",
  "This is a real NHL team. Respectable enough, but the crown stays in Los Angeles.",
  "Official team detected. The rating is honest, even if the app remains extremely biased."
];

const aliasIndex = new Map();

nhlTeams.forEach((team) => {
  team.aliases.forEach((alias) => {
    aliasIndex.set(normalizeTeamName(alias), team);
  });

  const option = document.createElement("option");
  option.value = team.name;
  teamOptions.append(option);
});

function normalizeTeamName(teamName) {
  return teamName
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\./g, "")
    .replace(/\bthe\b/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ");
}

function levenshteinDistance(left, right) {
  const distances = Array.from({ length: right.length + 1 }, (_, index) => index);

  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    let previousDiagonal = distances[0];

    distances[0] = leftIndex;

    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      const previousAbove = distances[rightIndex];
      const cost = left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1;

      distances[rightIndex] = Math.min(
        previousAbove + 1,
        distances[rightIndex - 1] + 1,
        previousDiagonal + cost
      );
      previousDiagonal = previousAbove;
    }
  }

  return distances[right.length];
}

function getFuzzyLimit(value) {
  if (value.length <= 3) {
    return 0;
  }

  if (value.length <= 7) {
    return 1;
  }

  if (value.length <= 13) {
    return 2;
  }

  return 3;
}

function findTeam(teamName) {
  const normalizedName = normalizeTeamName(teamName);
  const exactMatch = aliasIndex.get(normalizedName);

  if (exactMatch) {
    return { team: exactMatch, wasFuzzy: false };
  }

  let bestMatch = null;

  aliasIndex.forEach((team, alias) => {
    const distance = levenshteinDistance(normalizedName, alias);
    const limit = getFuzzyLimit(alias);

    if (distance <= limit && (!bestMatch || distance < bestMatch.distance)) {
      bestMatch = { team, alias, distance };
    }
  });

  if (!bestMatch) {
    return null;
  }

  return { team: bestMatch.team, wasFuzzy: true, matchedAlias: bestMatch.alias };
}

function rateTeam(teamName) {
  const match = findTeam(teamName);

  if (!match) {
    return {
      rating: "??",
      title: "That is not an NHL team",
      message: `"${teamName.trim()}" is not in the cached NHL team list. Try a real NHL team or pick one from the suggestions.`,
      className: "is-bad"
    };
  }

  if (match.team.name === "Los Angeles Kings") {
    return {
      rating: String(match.team.rating),
      title: "LA Kings: certified elite",
      message: "Official NHL team found. Perfect score. Regal, efficient, and clearly the only acceptable answer.",
      className: "is-kings"
    };
  }

  const messageIndex = match.team.name.length % nonKingsMessages.length;
  const fuzzyCopy = match.wasFuzzy ? ` I matched that to ${match.team.name}.` : "";

  return {
    rating: String(match.team.rating),
    title: `${match.team.name}: real, but not the Kings`,
    message: `${nonKingsMessages[messageIndex]}${fuzzyCopy}`,
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
