<script>
    import { products, webToken, query } from "../store.js";
    import {get} from "svelte/store";

    let filters = {
        name: "",
        description: "",
        minPrice: "",
        maxPrice: "",
    };

    export let url;

    function generateQuery() {
        const newQuery = new URLSearchParams();

        for (const key in filters) {
            if (filters[key]) {
                newQuery.append(key, filters[key]);
            }
        }

        console.log(newQuery.toString());

        query.set("?" + newQuery.toString());
        try {
            fetch(url + $query, {
                method: 'GET',
                headers: {
                    'Authorization': get(webToken)
                }
            })
                .then((res) => res.json())
                .then((data) => {
                    products.set(data);
                    console.log(data);
                });
            
        } catch (e) {
            alert("An error occurred, please try again later");
        }
    }
</script>

<div class="filter-box">
    <h2>Filter Query</h2>
    <form>
        <label for="name">Name:</label>
        <input type="text" id="name" bind:value={filters.name} />

        <label for="description">Description:</label>
        <input type="text" id="description" bind:value={filters.description} />

        <label for="min-price">Min bid:</label>
        <input type="number" id="min-price" bind:value={filters.minPrice} min="0"/>

        <label for="max-price">Max bid:</label>
        <input type="number" id="max-price" bind:value={filters.maxPrice} min="1"/>

        <button type="button" on:click={generateQuery}>Search</button>
    </form>
</div>

<style>
    label {
        display: block;
        margin-bottom: 8px;
    }

    input {
        width: 60%;
        padding: 8px;
        margin-left: 20px;
        margin-bottom: 20px;
        margin-right: 20px;
    }

    button {
        width: 67%;
        padding: 8px;
        margin-left: 20px;
        margin-bottom: 20px;
        margin-right: 20px;
    }

    .filter-box {
        background: #333;
        color: #fff;
    }
</style>
