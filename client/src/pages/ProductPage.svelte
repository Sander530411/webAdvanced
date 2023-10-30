<script>

    import {products, accountType, user, webToken} from "../store.js";
    import {onDestroy, onMount} from "svelte";
    import {get} from "svelte/store";
    import router from 'page';
    import BidsList from "../components/BidsList.svelte";


    // get id from url
    const url = window.location.href;
    const urlSplit = url.split("/");
    const ID = urlSplit[urlSplit.length - 1];
    let product = {};
    const bids = [];
    let interval;
    let bidAmount = 0;

    function bid(event) {
        // check if logged in
        if ($webToken === "" || $webToken === undefined || $webToken === null) {
            alert("You need to be logged in to bid");
            router.redirect("/login");

        } else if ($accountType === "admin") {
            alert("Admins can't bid");
        } else {
            event.preventDefault();
            fetch(`http://localhost:3000/products/${ID}/bid`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': get(webToken)
                },
                body: JSON.stringify({bid: bidAmount})
            });
            fetchData();
            alert("Bid placed");
        }
    }


    async function fetchData() {
        const response = await fetch(`http://localhost:3000/products/${ID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': get(webToken)
            }
        });
        if (!response.ok) {
            console.log("error", response.status);
        } else {
            product = await response.json();
        }
        for (const user in product.bids) {
            bids.push({user, amount: product.bids[user]});
        }
    }

    fetchData();

    onMount(() => {
        interval = setInterval(fetchData, 5000);
        return () => {
            clearInterval(interval);
        };
    });

    onDestroy(() => {
        clearInterval(interval);
    });

    export let params;
</script>

<main>
    <div class="details-box">
        <h1>{product.title}</h1>
        <img src={product.img} alt={product.title}>
        <p>{product.description}</p>
    </div>

    <div class="bids-box">
        <h2>Bids</h2>

        <form on:submit={bid}>
            <label for="bid">Bid</label>
            <input type="number" id="bid" name="bid" min="0" step="0.01" bind:value={bidAmount} required>
            <button type="submit">Bid</button>
        </form>

            <ul>
                {#if product.bids}
                    {#each Object.entries(product.bids) as [user, amount]}
                        <li>{user}: {amount}</li>
                    {/each}
                {:else}
                    <p>No bids available</p>
                {/if}
            </ul>
    </div>
</main>


<style>
    main {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }

    .details-box {
        width: 50%;
        margin: 20px;
        float: left;
        flex-direction: column;
        align-items: center;
    }

    img {
        width: 30%;
    }

    .bids-box {
        float: right;
        flex-direction: column;
        align-items: center;
    }

    ul {
        outline: #333 solid thin;
    }

    li {
        list-style: none;
    }
</style>