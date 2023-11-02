<script>
    import {webToken} from "../store.js";

    let productId = "";
    let productData = {};

    async function handleSubmit(event) {
        event.preventDefault();
        const res = await fetch(`http://localhost:3000/products/${productId}`);
        productData = await res.json();
    }

    async function handleUpdate(event) {
        event.preventDefault();
        await fetch(`http://localhost:3000/products/${productId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": $webToken,
            },
            body: JSON.stringify(productData)
        });
    }

    function handleDateChange(event) {
        const selectedDate = new Date(event.target.value);
        productData.expDate = Math.floor(selectedDate.getTime() / 1000);
    }

    function handleFileChange(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onload = () => {
                productData.img = reader.result;
            };

            reader.readAsDataURL(file);
        } else {
            productData.img = null;
        }
    }
</script>

<main>
    <h1>Edit Product</h1>

<form on:submit={handleSubmit}>
    <label for="productId">Product ID:</label>
    <input type="text" id="productId" bind:value={productId} />

    <button type="submit">Get Product Data</button>
</form>

================================

{#if productData.ID}
    <form on:submit={handleUpdate}>
        <label for="name">Name:</label>
        <input type="text" id="name" bind:value={productData.title} />

        <label for="description">Description</label>
        <textarea id="description" name="description" bind:value={productData.description} required></textarea>

        <label for="expiration-date">Expiration date</label>
        <input type="date" id="expiration-date" name="expiration-date" on:change={handleDateChange}>


        <label for="product-image">Product image</label>
        <input type="file" name="product image" id="product-image" on:change={handleFileChange} accept="image/png, image/jpeg">
        <img id="image-preview" alt="Preview" src={productData.img}>

        <button type="submit">Update Product</button>
    </form>
{/if}

</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        width: 350px;
        background: #333;
    }
    
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
    
    img {
        display: block;
        margin: 0 auto;
        width: 200px;
        height: 200px;
        margin-bottom: 20px;
    }
</style>
