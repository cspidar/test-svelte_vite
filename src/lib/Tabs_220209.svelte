<script>
  import { fly } from "svelte/transition";
  import { quintOut } from "svelte/easing";
  import Tab1 from "./Tab1.svelte";
  import Tab2 from "./Tab2.svelte";
  import Tab3 from "./Tab3.svelte";
  import { icon_list, icon_yet, icon_know } from "./icons.js";

  export let tabs = [
    { label: "Checks", icon: icon_list, value: 1, component: Tab1 },
    { label: "Yets", icon: icon_yet, value: 2, component: Tab2 },
    { label: "Knows", icon: icon_know, value: 3, component: Tab3 },
  ];
  let activeTabValue = 1;
  let tabRight = true;

  const handleClick = (tabValue) => {
    tabValue > activeTabValue ? (tabRight = true) : (tabRight = false);
    return (activeTabValue = tabValue);
  };
</script>

<div class="topTabs w-screen fixed top-0 left-0 right-0 z-50 backdrop-blur">
  <ul class="justify-center mt-2 text-l text-slate-700">
    {#each tabs as tab}
      <li class={activeTabValue === tab.value ? "active" : ""}>
        <span class="tabs" on:click={handleClick(tab.value)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="inline h-6 w-6"
            fill="none"
            viewBox="2 2 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d={tab.icon}
            />
          </svg>
          {tab.label}
        </span>
      </li>
    {/each}
  </ul>
</div>

<div class="mt-8">
  {#each tabs as tab}
    {#if activeTabValue == tab.value}
      {#if tabRight}
        <div
          class="box"
          in:fly={{
            delay: 0,
            duration: 300,
            x: 500,
            opacity: 1,
            easing: quintOut,
          }}
        >
          <svelte:component this={tab.component} />
        </div>
      {:else}
        <div
          class="box"
          in:fly={{
            delay: 0,
            duration: 300,
            x: -500,
            opacity: 1,
            easing: quintOut,
          }}
        >
          <svelte:component this={tab.component} />
        </div>
      {/if}
    {/if}
  {/each}
</div>

<style>
  .box {
    margin-bottom: 10px;
    padding-top: 40px;
    padding-bottom: 40px;
    padding-left: 2vw;
    padding-right: 2vw;
    /* border: 1px solid #dee2e6; */
    border-radius: 0 0 0.5rem 0.5rem;
    border-top: 0;
  }
  ul {
    display: flex;
    flex-wrap: wrap;
    padding-left: 0;
    margin-bottom: 0;
    list-style: none;
    border-bottom: 1px solid #dee2e6;
  }
  li {
    width: 30vw;
    margin-bottom: -1px;
    text-align: center;
    font-weight: 700;
  }
  /* .topTabs {
    overflow-x: hidden;
    overflow-y: hidden;
  } */
  span.tabs {
    border: 1px solid transparent;
    border-top-left-radius: 0.25rem;
    border-top-right-radius: 0.25rem;
    display: block;
    padding: 0.5rem 1rem;
    cursor: pointer;
  }

  span.tabs:hover {
    border-color: #e9ecef #e9ecef #dee2e6;
  }

  li.active > span.tabs {
    color: #495057;
    background-color: #fff;
    border-color: #dee2e6 #dee2e6 #fff;
  }
</style>
