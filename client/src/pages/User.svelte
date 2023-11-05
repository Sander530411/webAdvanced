<script>
    import router from "page";
    import { accountType, user } from '../store.js';
    
    if ($accountType === "") {
        alert("You are not logged in. You will be redirected to the login page.");
        router.redirect("/login");
    } else if ($accountType !== "user") {
        alert("You are not authorized to view this page. You will be redirected to the home page.");
        router.redirect("/");
    }

    // fetch all bids made by the user
    let bids = [];
    fetch("http://localhost:3000/bids")
        .then(res => res.json())
        .then(data => {
            data.forEach(bid => {
                if (bid === $user) {
                    bids.push(bid);
                }
            });
        })
        .catch(err => console.log(err));

</script>

<main>
    <h1>hello {$user}</h1>
    <!-- list of all bids the user has made on products imported from the fetch at localhost:3000/products -->
    <h2>My Bids</h2>
    <ul>
        {#each bids as bid}
            <li>
                <p>Product: {bid.product}</p>
                <p>Amount: {bid.amount}</p>
                <p>Time: {bid.time}</p>
            </li>
        {/each}
    </ul>

</main>

<style>

</style>