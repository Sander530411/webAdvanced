import { writable } from 'svelte/store';
export const webToken = writable("");
export const user = writable("");
export const accountType = writable("");

export let query = writable("");

export let products = writable([]);


