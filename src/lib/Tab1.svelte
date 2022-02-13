<script>
  import { removeFromList, addToList, ori_items } from "./wordlist";
  import { icon_yet, icon_know } from "./icons.js";
  import { fade, scale } from "svelte/transition";

  export let items = ori_items;
  export let knows = [];
  export let yets = [];

  let wordStatus;
  let meanStatus;
  let subBtnStatus;
  function refreshList() {
    wordStatus = new Array(items.length).fill(false);
    meanStatus = new Array(items.length).fill(false);
    subBtnStatus = new Array(items.length).fill(false);
  }
  refreshList();

  let btnStyle =
    "bg-white hover:bg-slate-100 text-slate-800 font-semibold py-3 px-4 border border-slate-400 rounded shadow text-sm h-fit";
  let subBtnStyle =
    "bg-white hover:bg-slate-200 hover:scale-105 text-slate-800 font-semibold py-2 px-1 border border-slate-400 rounded  text-sm h-9 relative transition-all active:scale-105 active:bg-slate-300";
</script>

<div class="grid md:grids-cols-2 lg:grid-cols-3 gap-4 mb-2 break-words">
  {#each items as item, i}
    <div class="flex ">
      <button
        class="{btnStyle} 
        {wordStatus[i] ? 'w-3/5' : 'w-2/5'} 
        transition-all delay-75 relative block"
        on:click={() => {
          wordStatus[i] = !wordStatus[i];
        }}
      >
        <div class="relative">
          <p
            class="{wordStatus[i]
              ? 'blur-sm'
              : ''} z-10 transition-all delay-75 relative block"
          >
            {item.word}
          </p>
        </div>

        {#if wordStatus[i]}
          <div
            in:fade|local={{ duration: 200, delay: 300 }}
            out:fade={{ duration: 50, delay: 50 }}
            on:introstart={() => {
              subBtnStatus[i] = !subBtnStatus[i];
            }}
            on:outrostart={() => {
              subBtnStatus[i] = !subBtnStatus[i];
            }}
            class="{subBtnStatus[i]
              ? 'scale-100'
              : 'scale-0'} absolute top-1 transition-all delay-200 z-10"
          >
            <button
              class="{subBtnStyle} inline-block px-2 z-50"
              on:click={() => {
                knows = addToList(knows, item);
                items = removeFromList(items, item);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="inline-block relative h-5 w-5"
                fill="none"
                viewBox="2 2 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d={icon_know}
                />
              </svg>
              I know!
            </button>
            <button
              class="{subBtnStyle} inline-block px-2 ml-2 z-50"
              on:click={() => {
                yets = addToList(yets, item);
                items = removeFromList(items, item);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="inline-block relative h-5 w-5"
                fill="none"
                viewBox="2 2 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d={icon_yet}
                />
              </svg>
              Yet...
            </button>
          </div>
        {/if}
      </button>

      <button
        class="{btnStyle} {wordStatus[i]
          ? 'w-2/5 animate-bounce'
          : 'w-3/5'} relative transition-all ml-2"
      >
        {#if wordStatus[i]}
          <p class="text-center">
            {item.word}
          </p>
        {/if}
        {#if !wordStatus[i]}
          <p class="text-left">
            {item.example}
          </p>
        {/if}
      </button>
    </div>
  {/each}
</div>

<div class="m-2 p-2 h-20 border-8 block">
  <div class="border-4 h-10 relative">
    <p class="border-2 absolute top-1/2 -translate-y-1/2">1111</p>
    <p class="border-2 absolute top-1/2 -translate-y-1/2">2222</p>
  </div>
</div>

<style>
  @keyframes bounce {
    0%,
    100% {
      transform: translateY(-12%);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    50% {
      transform: translateY(+5%);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
  }
  .animate-bounce {
    animation: bounce 0.7s infinite;
  }
  .inactiveBtn {
    width: 0px;
    height: 0px;
    font-size: 0px;
  }
</style>
