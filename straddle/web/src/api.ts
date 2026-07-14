const API_BASE = "";

async function fetchJson(endpoint: string, options?: RequestInit): Promise<any> {
  const response = await fetch(`${API_BASE}${endpoint}`, options);
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return response.json();
}

export async function createSolver(params: {
  oop_range: string;
  ip_range: string;
  board: string;
  starting_pot: number;
  effective_stack: number;
  bet_sizes?: string;
  raise_sizes?: string;
}): Promise<string> {
  const response = await fetch(`/api/solvers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return (await response.json()).id;
}

export async function getSolver(id: string): Promise<any> {
  return fetchJson(`/api/solvers/${id}`);
}

export async function deleteSolver(id: string): Promise<void> {
  await fetch(`/api/solvers/${id}`, { method: "DELETE" });
}

export async function solve(
  id: string,
  params: { iterations: number }
): Promise<void> {
  return fetchJson(`/api/solvers/${id}/solve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
}

export function getPlayerQuery(player?: string): string {
  return player ? `?player=${player}` : "";
}

export async function getStrategy(id: string, player?: string): Promise<any> {
  return fetchJson(`/api/solvers/${id}/strategy${getPlayerQuery(player)}`);
}

export async function getEquity(id: string, player?: string): Promise<any> {
  return fetchJson(`/api/solvers/${id}/equity${getPlayerQuery(player)}`);
}

export async function getEV(id: string, player?: string): Promise<any> {
  return fetchJson(`/api/solvers/${id}/ev${getPlayerQuery(player)}`);
}

export async function getRange(id: string, player?: string): Promise<any> {
  return fetchJson(`/api/solvers/${id}/range${getPlayerQuery(player)}`);
}

export async function playAction(id: string, action: string): Promise<any> {
  return fetchJson(`/api/solvers/${id}/play`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action }),
  });
}

export async function backToRoot(id: string): Promise<any> {
  return fetchJson(`/api/solvers/${id}/back-to-root`, { method: "POST" });
}

export async function backOneStep(id: string): Promise<any> {
  return fetchJson(`/api/solvers/${id}/back`, { method: "POST" });
}

export async function gotoStep(id: string, step: number): Promise<any> {
  return fetchJson(`/api/solvers/${id}/goto?step=${step}`, { method: "POST" });
}

export async function getHistory(id: string): Promise<any> {
  return fetchJson(`/api/solvers/${id}/history`);
}

export async function getPossibleCards(id: string): Promise<any> {
  return fetchJson(`/api/solvers/${id}/possible-cards`);
}

export async function lockStrategy(
  id: string,
  strategy: any
): Promise<any> {
  return fetchJson(`/api/solvers/${id}/lock`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(strategy),
  });
}

export async function unlockStrategy(id: string): Promise<void> {
  await fetch(`/api/solvers/${id}/lock`, { method: "DELETE" });
}

export function createSSE(
  id: string,
  callbacks: {
    onProgress?: (data: any) => void;
    onDone?: (data: any) => void;
    onError?: (error: any) => void;
  }
): EventSource {
  const eventSource = new EventSource(`/api/solvers/${id}/progress`);
  
  eventSource.addEventListener("progress", (event: MessageEvent) => {
    callbacks.onProgress?.(JSON.parse(event.data));
  });
  
  eventSource.addEventListener("done", (event: MessageEvent) => {
    callbacks.onDone?.(JSON.parse(event.data));
    eventSource.close();
  });
  
  eventSource.addEventListener("error", (event: MessageEvent) => {
    callbacks.onError?.(JSON.parse(event.data));
    eventSource.close();
  });
  
  return eventSource;
}