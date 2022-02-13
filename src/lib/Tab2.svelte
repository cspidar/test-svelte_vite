<script>
  import { onMount } from "svelte";
  import Tab1 from "./Tab1.svelte";

  let know_list;
</script>

<Tab1 bind:knows={know_list} />

<button
  on:click={() => {
    console.log(know_list[0]);
  }}>1111</button
>
