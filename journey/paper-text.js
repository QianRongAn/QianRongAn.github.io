// Keep the last line natural; distribute only wrapped lines across the measure.
export function drawPaperLine(ctx, text, x, y, width, justify = false) {
 const words = text.trim().split(/\s+/);
 if (!justify || words.length < 2) { ctx.fillText(text, x, y); return; }
 const ink = words.reduce((sum, word) => sum + ctx.measureText(word).width, 0);
 const gap = (width - ink) / (words.length - 1);
 for (const word of words) { ctx.fillText(word, x, y); x += ctx.measureText(word).width + gap; }
}
