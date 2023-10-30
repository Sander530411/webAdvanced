<script>
    import Filters from "../components/Filters.svelte";
    import {products, query, webToken, user} from "../store.js";
    import {get} from "svelte/store";
    import {onDestroy, onMount} from "svelte";
    import Product from "../components/Product.svelte";
    import router from "page";

    function fetchData() {
        fetch(`http://localhost:3000/products${get(query)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': get(webToken)
            }
        })
            .then(response => response.json())
            .then(data => {
                products.set(data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    function formatExpDate(expDate) {
        const date = new Date(expDate * 1000);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year} ${date.getHours()}:${date.getMinutes()}`
    }

    fetchData();

    let interval;

    onMount(() => {
        interval = setInterval(fetchData, 5000);
        return () => {
            clearInterval(interval);
        };
    });

    onDestroy(() => {
        clearInterval(interval);
    });

    export let params
</script>

<main>
    <div class="filter-box">
        <Filters url="http://localhost:3000/products"/>
    </div>
    <div class="products">

        <h1>Welcome to the svelte store</h1>
        <p>these are the products that are currently for sale for sale</p>

        {#if $products.length === 0}
            <p>Loading...</p>
        {:else}
            <div class="product-container">
                {#each $products as product (product.ID)}
                    <div class="product">
                        <!--TODO make img work for product-->
                        {#if product.bids.length > 0}
                            <Product
                                    title={product.title}
                                    imageSrc={product.img}
                                    description={product.description}
                                    maxPrice={Math.max(...product.bids.map(bid => Object.values(bid)[0]))}
                                    date={formatExpDate(product.expDate)}
                                    clicked={() => {
                                    router(`/product/${product.ID}`)
                                }}/>
                        {:else}
                            <Product
                                    title={product.title}
                                    imageSrc={product.img}
                                    description={product.description}
                                    date={formatExpDate(product.expDate)}
                                    clicked={() => {
                                    router(`/product/${product.ID}`)
                                }}/>
                        {/if}
                    </div>
                {/each}
            </div>
        {/if}
    </div>
</main>

<style>
    main {
        margin: 0;
        padding: 10px;
    }

    .filter-box {
        float: left;
        margin-left: 0;
        max-width: 13%;
    }

    .products {
        float: right;
    }

    .product-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        margin-right: 40px;
    }

    .product {
        width: calc(33.33% - 10px);
        margin-bottom: 20px;
        margin-top: 10px;
    }
</style>
