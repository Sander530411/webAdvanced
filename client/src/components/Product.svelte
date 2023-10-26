<script>
    export let title;
    export let imageSrc = "../src/assets/svelte.png";
    // export let minPrice = 0;
    // export let maxPrice = 0;
    export let description;

    export let clicked = () => {};

    function handleClick() {
        clicked();
    }
    function handleKeyDown(event) {
        if (event.key === "Enter") {
            clicked();
        }
    }
</script>

<div on:click={handleClick} on:keydown={handleKeyDown} role="button" tabindex="0" class="product">
    <h2>{title}</h2>
    <img src={imageSrc} alt={title} />

    <div class="price-range">
<!--        <span class="min-price">Min Price: ${minPrice.toFixed(2)}</span>-->
<!--        <span class="max-price">Max Price: ${maxPrice.toFixed(2)}</span>-->
    </div>
    <p>{description}</p>
</div>

<style>

    .product {
        border: 1px solid #ccc;
        padding: 10px;
        margin: 10px;
        text-align: center;
        width: 450px;
    }

    .product:hover {
        border-color: #999;
    }

    .price-range {
        margin-top: 10px;
    }

    .min-price, .max-price {
        font-weight: bold;
    }

    img {
        width: 50%;
    }
</style>
