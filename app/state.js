/* =====================================================================
   /app/state  (in-memory, hydrated from session + services)
   ===================================================================== */
const State = { station: null, rental: null, pb: null, payError: null, paying: false };

async function loadStation(id) {
  State.station = await API.stations.get(id);
  return State.station;
}
async function refreshRental() {
  const id = Session.data.rentalId; if (!id) { State.rental = null; return null; }
  try { State.rental = await API.rentals.get(id); } catch { State.rental = null; Session.clearRental(); }
  return State.rental;
}
const rentalIsLive = r => r && ['active', 'awaiting_return'].includes(r.status);
