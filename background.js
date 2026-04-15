
const URL = "https://artemis.cdnspace.ca/";

async function fetchStatus() {
  try {
    const res = await fetch(URL, { cache: "no-store" });
    const html = await res.text();

    const { status, detail } = parseStatus(html);
    updateUI(status, detail);
  } catch (e) {
    console.error(e);
    updateUI("ERR", "Errore fetch/parsing");
  }
}

function parseStatus(html) {
  const lower = html.toLowerCase();

  if (lower.includes("no go") || lower.includes("no-go")) {
    return { status: "NO", detail: "The toilet works!" };
  }

  if (lower.includes(">go<") || lower.includes(" go ")) {
    return { status: "GO", detail: "Toilet out of order!!!" };
  }

  return { status: "UNK", detail: "Unkwown toilet status" };
}

function updateUI(status, detail) {
  let color = "gray";
  let title = "TOILET: UNKNOWN";

  if (status === "GO") {
    color = "green";
    title = `TOILET: GO\n${detail}`;
  }

  if (status === "NO") {
    color = "red";
    title = `TOILET: NO-GO\n${detail}`;
  }

  if (status === "ERR") {
    color = "orange";
    title = `TOILET: ERROR\n${detail}`;
  }

  chrome.action.setBadgeText({ text: status });
  chrome.action.setBadgeBackgroundColor({ color });
  chrome.action.setTitle({ title });
}

chrome.alarms.create("refresh", { periodInMinutes: 0.5 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "refresh") {
    fetchStatus();
  }
});

fetchStatus();

