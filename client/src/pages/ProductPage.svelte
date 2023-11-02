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
    let interval;
    let bidAmount = 0;

    async function bid(event) {
        event.preventDefault();
        if (product.expDate < Date.now() / 1000) {
            alert("This product has expired");
        } else if (product.bids.length > 0 && bidAmount <= Math.max(...product.bids.map(bid => Object.values(bid)[0]))) {
            alert("Bid must be higher than current price");
        } else {
            // check if logged in
            if ($webToken === "" || $webToken === undefined || $webToken === null) {
                alert("You need to be logged in to bid");
                router.redirect("/login");
            } else if ($accountType === "admin") {
                alert("Admins are not allowed to bid");
            } else {
                event.preventDefault();
                await fetch(`http://localhost:3000/products/${ID}/bid`, {
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
    }

    function formatExpDate(expDate) {
        const date = new Date(expDate * 1000);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year} ${date.getHours()}:${date.getMinutes()}`
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
    }

    async function deleteProduct(event) {
        event.preventDefault();
        const response = await fetch(`http://localhost:3000/products/${ID}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'authorization': get(webToken)
            }
        });
        if (response.ok) {
            router.redirect("/");
        } else if (response.status === 401) {
            alert("You need to be logged in to delete a product");
            router.redirect("/login");
        } else {
            alert("could not delete product, try again later")
            console.log("error", response.status);
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
            <input type="number" id="bid" name="bid" min="0" step="1" bind:value={bidAmount} required>
            <button type="submit">Bid</button>
        </form>
        <br>
        <span class="expireDate">expires on: {formatExpDate(product.expDate)}</span>
        <ul>
            {#if product.bids && product.bids.length > 0}
                {#each product.bids as bid}
                    <li>{Object.keys(bid)}: ${Object.values(bid)}</li>
                {/each}
            {:else}
                <p>No bids available</p>
            {/if}
        </ul>
        {#if $accountType === "admin"}
            <button on:click={deleteProduct}>Delete product</button>
        {/if}
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

    .expireDate {
        font-size: 0.8em;
        color: red;
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