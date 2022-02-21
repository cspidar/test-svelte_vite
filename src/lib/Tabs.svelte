<script>
  import { quintOut } from "svelte/easing";
  import { fly, fade, slide, crossfade } from "svelte/transition";
  import { flip } from "svelte/animate";
  import { refresh, icon_list, icon_yet, icon_know } from "./icons.js";
  import { ori_items } from "./word/wordList_endGame";
  import { E } from "../../dist/assets/vendor.394aa63e.js";

  export const removeFromList = (list, i) => list.splice(i, 1);
  export const addToList = (list, item) => list.push(item);

  const btnStyle =
    "bg-white hover:bg-slate-100 text-slate-800 font-semibold py-3 px-4 border border-slate-400 rounded shadow text-sm h-fit";
  const subBtnStyle =
    "bg-white hover:bg-slate-200 hover:scale-105 text-slate-800 font-semibold py-2 px-1 border border-slate-400 rounded  text-sm h-9 relative transition-all active:scale-105 active:bg-slate-300";

  // Tabs start
  export let tabs = [
    { label: "Checks", icon: icon_list, value: 1 },
    { label: "Yets", icon: icon_yet, value: 2 },
    { label: "Knows", icon: icon_know, value: 3 },
  ];
  let activeTabValue = 1;
  let tabRight = true;

  const handleClick = (tabValue) => {
    tabValue > activeTabValue ? (tabRight = true) : (tabRight = false);
    return (activeTabValue = tabValue);
  };
  // Tabs end

  // Tab1 start

  // save data
  // export let items = ori_items;
  let items = JSON.parse(JSON.stringify(ori_items)); // 깊은 복사
  export let checks = [];
  export let knows = [];
  export let yets = [];
  function fillChecks() {
    if (checks.length < 1) {
      for (let i = 0; i < 20; i++) {
        if (items[0] !== undefined) {
          checks.push(items.shift());
        }
      }
    }
  }

  function loadList() {
    try {
      const chkSave = JSON.parse(localStorage.getItem("checks"));
      if (chkSave === null || chkSave === undefined) return;
      else {
        checks = JSON.parse(localStorage.getItem("checks"));
        knows = JSON.parse(localStorage.getItem("knows"));
        yets = JSON.parse(localStorage.getItem("yets"));
      }
    } catch (e) {
      console.error(e);
    }
  }
  loadList();

  function resetList() {
    items = JSON.parse(JSON.stringify(ori_items));
    checks = [];
    knows = [];
    yets = [];
    refreshList();
    fillChecks();
  }

  $: localStorage.setItem("checks", JSON.stringify(checks));
  $: localStorage.setItem("knows", JSON.stringify(knows));
  $: localStorage.setItem("yets", JSON.stringify(yets));

  let wordStatus;
  let meanStatus;
  let subBtnStatus;
  function refreshList() {
    wordStatus = new Array(checks.length).fill(false);
    meanStatus = new Array(checks.length).fill(false);
    subBtnStatus = new Array(checks.length).fill(false);
  }
  refreshList();

  // Tab1 end
</script>

<div class="topTabs w-screen fixed top-0 left-0 right-0 z-50 backdrop-blur">
  <ul class="justify-center mt-2 text-l text-slate-700">
    <button
      class="mr-2 hover:scale-90 active:scale-90 active:-rotate-180 transition-all ease-in-out duration-300"
      on:click={refreshList}
      on:click={resetList}
      ><svg
        xmlns="http://www.w3.org/2000/svg"
        class="inline-block h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d={refresh}
        />
      </svg>
    </button>
    {#each tabs as tab}
      <li class={activeTabValue === tab.value ? "active" : ""}>
        <span
          class="tabs"
          on:click={handleClick(tab.value)}
          on:click={refreshList}
        >
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
      <div
        class="box"
        in:fly={tabRight
          ? {
              delay: 0,
              duration: 300,
              x: 500,
              opacity: 1,
              easing: quintOut,
            }
          : {
              delay: 0,
              duration: 300,
              x: -500,
              opacity: 1,
              easing: quintOut,
            }}
      >
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-2 break-words">
          <!-- Tab1 -->
          {#if tab.value === 1}
            {#each checks as check, i (check)}
              <div
                class="flex"
                animate:flip={{ duration: 300 }}
                out:fade|local={{ duration: 100 }}
                in:fly|local={{ duration: 300 }}
              >
                <button
                  class="{btnStyle} 
                {wordStatus[i] ? 'w-3/5' : 'w-2/5'} 
                transition-all delay-75 relative block"
                  on:click={() => {
                    wordStatus[i] = !wordStatus[i];
                  }}
                >
                  <div class="relative">
                    <div
                      class="{wordStatus[i]
                        ? 'blur-sm'
                        : ''} z-10 transition-all delay-75 block"
                    >
                      {check.word}
                    </div>
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
                          addToList(knows, check);
                          removeFromList(checks, i);
                          fillChecks();
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
                          addToList(yets, check);
                          removeFromList(checks, i);
                          fillChecks();
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
                      {check.word}
                    </p>
                  {/if}
                  {#if !wordStatus[i]}
                    <p class="text-left">
                      {check.en[0]}
                    </p>
                  {/if}
                </button>
              </div>
            {/each}
          {/if}
          <div>남은 단어 숫자</div>
          <!-- Tab1 -->

          <!-- Tab2 -->
          {#if tab.value === 2}
            {#each yets as yet, i (yet)}
              <div
                class={btnStyle}
                animate:flip={{ duration: 200 }}
                in:fade|local={{ duration: 100 }}
              >
                <p class="text-xl mb-1">{yet.word}</p>
                <hr />
                {#each yet.time as examNum, j (examNum)}
                  <p class="text-xs mt-4">{yet.time[j]}</p>
                  <p class="text-sm">{yet.en[j]}</p>
                  <p class="text-sm mb-2">{yet.ko[j]}</p>
                  <hr />
                {/each}
              </div>
            {/each}
          {/if}

          <!-- Tab3 -->
          {#if tab.value === 3}
            {#each knows as know, i (know)}
              <div
                class={btnStyle}
                animate:flip={{ duration: 200 }}
                in:fade|local={{ duration: 100 }}
              >
                <p class="text-xl mb-1">{know.word}</p>
                <hr />
                <p class="text-base">{know.time[0]}</p>
                <p class="text-base">{know.en[0]}</p>
                <p class="text-base">{know.ko[0]}</p>
              </div>
            {/each}
          {/if}
        </div>
      </div>
    {/if}
  {/each}
</div>

<style>
  /* Tabs */
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

  /* Tab1 */
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

  div {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }
</style>
