// scroll-world's coalesced-seek pattern, adapted to the existing reading stops.
// Only one seek may be in flight; completion catches up to the latest target.
export function createVideoScrubber(video){
 let wanted=0;
 function flush(){if(video.readyState<2||video.seeking||!Number.isFinite(video.duration))return;if(Math.abs(video.currentTime-wanted)>1/48)video.currentTime=wanted;}
 video.addEventListener('seeked',flush);video.addEventListener('loadeddata',flush);
 return {setProgress(progress){const duration=Number.isFinite(video.duration)?video.duration:0;wanted=Math.max(0,Math.min(1,progress))*Math.max(0,duration-1/48);flush();},get targetTime(){return wanted;},dispose(){video.removeEventListener('seeked',flush);video.removeEventListener('loadeddata',flush);}};
}
