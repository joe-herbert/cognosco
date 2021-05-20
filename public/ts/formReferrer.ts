window.addEventListener('load', () => {
    let referrerInput = <HTMLInputElement>document.getElementById('referrer');
    referrerInput.value = document.referrer;
});