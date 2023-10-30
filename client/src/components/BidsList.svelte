<script>
    export let bids;
</script>

<ul>
    {#each bids as bid (bid.user)}
        <li>User: {bid.user}, Amount: {bid.amount}</li>
    {/each}
</ul>


<style>
    li {
        list-style-type: none;
        font-weight: bold;
    }
</style>
