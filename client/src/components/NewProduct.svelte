<script>
    import {products, query, webToken} from "../store.js";
    import {get} from "svelte/store";

    let data = {
        name: "",
        description: "",
        image: null
    };

    async function submit(event) {
        event.preventDefault();
        console.log(data);
        fetch("http://localhost:3000/products", {
            method: 'POST',
            headers: {
                'Authorization': $webToken},
            body: JSON.stringify(data)
        })
            .then((res) => res.json())
            .then((data) => {
                products.set(data);
                console.log(data);
            });
    }

    function handleFileChange(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onload = () => {
                data.image = reader.result;
            };

            reader.readAsDataURL(file);
        } else {
            data.image = null;
        }
    }
</script>

<main>
    <form on:submit={submit}>
        <h2>New product</h2>
        <p>Fill out all the data to add a new product</p>
        <br>
        <label for="name">Name</label>
        <input type="text" id="name" name="name" bind:value={data.name} required>

        <label for="description">Description</label>
        <textarea id="description" name="description" bind:value={data.description} required></textarea>

        <label for="product-image">Product image</label>
        <input type="file" name="product image" id="product-image" on:change={handleFileChange} accept="image/png, image/jpeg">
        <img id="image-preview" alt="Preview" src={data.image}>

        <button type="submit">Add product</button>
    </form>
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        width: 350px;
        background: #333333;
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