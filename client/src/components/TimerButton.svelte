<script>
    import { onDestroy, onMount } from "svelte";

    export let seconds = 10;
    export let onTimeout;

    let timer;

    function resetTimer() {
        seconds = 10;
        clearInterval(timer);
        timer = setInterval(() => {
            if (seconds === 0) {
                clearInterval(timer);
                onTimeout();
            } else {
                seconds -= 1;
            }
        }, 1000);
    }

    onMount(() => {
        timer = setInterval(() => {
            if (seconds === 0) {
                clearInterval(timer);
                onTimeout();
            } else {
                seconds -= 1;
            }
        }, 1000);
        return () => {
            clearInterval(timer);
        };
    });

    onDestroy(() => {
        clearInterval(timer);
    });
</script>

<button on:click={resetTimer}>
    {seconds} seconds remaining
</button>