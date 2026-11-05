// The reveal and the wingbeat are separate: a completed reveal must never freeze the wings.
export function advanceWingClock(phase,delta,flight,opening){
 const speed=(13-12*flight)*(1-opening)+opening;
 return phase+Math.max(0,Math.min(.25,delta))*speed;
}
export function breathingWingPose(phase,opening,side,hind){
 const p=phase-(hind?.24:0),flightAngle=.24+Math.sin(p)*.75,restAngle=.48+Math.sin(p)*.38;
 return {y:side*(flightAngle*(1-opening)+restAngle*opening),x:Math.sin(p-.25)*.025};
}
