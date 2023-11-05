<script>
    import router from "page";
    import {accountType, user, webToken} from '../store.js';
    import {get} from "svelte/store";

    if ($accountType === "") {
        alert("You are not logged in. You will be redirected to the login page.");
        router.redirect("/login");
    } else if ($accountType !== "user") {
        alert("You are not authorized to view this page. You will be redirected to the home page.");
        router.redirect("/");
    }

    // fetch all bids made by the user

    let bids = [];
    async function fetchData() {
        const response = await fetch(`http://localhost:3000/users/${$user}/bids`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': get(webToken)
            }
        });
        if (response.ok) {
            bids = await response.json();
            console.log(bids);
        } else {
            console.error("HTTP-Error: " + response.status);
        }
    }
    fetchData();

    export let params;
</script>

<main>
    <h1>hello {$user}</h1>
    <h2>My Bids</h2>
    <ul>
        {#each bids as bid}
            <li on:click={router.redirect(`/product/${bid.ID}`)}>
                <p>title: {bid.title}</p>
                <p>bid: {bid.bid}</p>
            </li>
        {/each}
    </ul>

</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    ul {
        list-style-type: none;
    }

    li {
        margin: 1rem;
        padding: 1rem;
        border: 1px solid black;
    }

    li:hover {
        border-color: #999;
    }

</style>