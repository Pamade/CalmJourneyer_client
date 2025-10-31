interface SessionRequest {
    goal: 'STRESS_RELIEF' | 'FOCUS' | 'SLEEP' | 'ENERGY' | 'SILENCE';
    duration: 5 | 10 | 15 | 20; // minutes
    voice: 'LUNA' | 'LAUREN' | 'CALEB' | 'DANIEL';
    position: 'SITTING' | 'LYING' | 'STANDING';
    eyes: 'CLOSED' | 'OPEN';
}

// const response = await fetch('/api/sessions/generate', {
//   method: 'POST',
//   headers: { 'Content-Type': 'application/json' },
//   body: JSON.stringify({
//     goal: 'STRESS_RELIEF',
//     duration: 10,
//     voice: 'ANNA',
//     position: 'SITTING',
//     eyes: 'CLOSED'
//   })
// });